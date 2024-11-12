// Name : Shubhangi Mahadev Metkari
// Task Name: Applicant Form
// date : 21-10-2024

import {
  faBriefcase,
  faCalendarAlt,
  faCertificate,
  faIndianRupeeSign,
  faEnvelope,
  faGraduationCap,
  faMapMarkerAlt,
  faPhone,
  faUser,faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControlLabel, Radio, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import logo1 from "../LogoImages/logoweb2.png";
import "../Applicant/applicantFrom.css";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import { useParams } from "react-router-dom";

const ApplicantForm = ({loginEmployeeName}) => {
  const { userType, employeeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [resumeSelected, setResumeSelected] = useState(false);
  const [photoSelected, setPhotoSelected] = useState(false);
  const dateInputRef = useRef(null);
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
    lineUp: {
      experienceYear: "",
      relevantExperience: "",
      currentCTCLakh: "",
      expectedCTCLakh: "",
      qualification: "",
      preferredLocation: "",
      noticePeriod: "",
      gender: "",
      availabilityForInterview: "",
      sslCertificates: "",
      relocateStatus: "",
      holdingAnyOffer: "",
      expectedJoinDate: "",
      resume: [],
      photo: [],
      offerdetails: "",
      companyName: "",
      offersalary: "",
      experienceMonth: "",
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
  const { name, files } = e.target;

  if (name === "lineUp.resume" && files.length > 0) {
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
      // Update form data here if needed
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
          [questionKey]: e.target.type === "file" ? files[0] :e.target.value,
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
          [nestedField]: e.target.type === "file" ? files[0] :  e.target.value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.type === "file" ? files[0] : e.target.value,

      }));
    }
  };

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
  

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        // Convert resume and photo to base64 if they exist
        resume: formData.lineUp.resume instanceof File
          ? await convertToBase64(formData.lineUp.resume)
          : formData.lineUp.resume,
        photo: formData.lineUp.photo instanceof File
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
  
    console.log("FormData before submission:", updatedFormData);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/save-applicant`,
        updatedFormData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Form submitted successfully:", response.data);
      toast.success("Your Details Submitted Successfully");
      setFormData(initialFormData);
      setResumeSelected(false);
      setPhotoSelected(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit details");
    } finally {
      setLoading(false);
    }
  };
  
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 50) {
        setIsScrolled(true);
        setScrollingUp(lastScrollY > currentScrollY); // Detect scroll direction
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

  return (
    <div className="applicant-form-main-div">
      {loading && <Loader />}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className={`applicant-main-div ${isScrolled ? "scrolled" : ""}`}>
          <div className="applicant-sub-div">
            <div
              className={`applicant-logo-container ${
                scrollingUp ? "show-description" : "hide-description"
              }`}
            >
              <div className="applicant-logo-name-div">
                <div className="applicant-form-logo">
                  <img src={logo1} alt="Company Logo" className="logo" />
                </div>
                <h1 className="company-name crimson-text-regular">
                  157 Industries Private Limited
                </h1>
              </div>
              {/* {!isScrolled && ( */}
              <p className="description">
                an exceptionally unique experience tailored to you We are idea
                generators, goal seekers, challenge-thirsty professionals,
                creators of unique Internet projects. We deliver unconventional
                solutions
              </p>
              {/* )} */}
            </div>
          </div>
          <div className="form-main-div">
            <div className="form-sub-div">
              <div className="applicant-form-container scrollable-hidden-scrollbar">
                <div className="appliacnt-form-heading">
                  <h1>Applicant Form</h1>
                </div>
                <form
                  className="share-link-applicant-form"
                  onSubmit={handleSubmit}
                >
                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Full Name
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="candidateName"
                          placeholder="Candidate's Full Name"
                          value={formData.candidateName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Contact Number
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faPhone}
                          className="applicant-form-icons"
                        />
                        <input
                          type="number"
                          placeholder="Contact Number"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Email Address
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className="applicant-form-icons"
                        />
                        <input
                          type="email"
                          name="candidateEmail"
                          placeholder="Candidate Email"
                          value={formData.candidateEmail}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Current Salary
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="applicant-form-icons"
                        />
                        <input
                          type="number"
                          name="lineUp.currentCTCLakh"
                          placeholder="Lakhs"
                          value={formData.lineUp.currentCTCLakh}
                          onChange={handleChange}
                          required
                        />
                        <span>-</span> {/* Optional separator */}
                        <input
                          type="number"
                          name="lineUp.currentCTCThousand"
                          placeholder="Thousands"
                          value={formData.lineUp.currentCTCThousand}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Expected Salary
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="applicant-form-icons"
                        />
                        <input
                          type="number"
                          name="lineUp.expectedCTCLakh"
                          placeholder="Lakhs"
                          value={formData.lineUp.expectedCTCLakh}
                          onChange={handleChange}
                          required
                        />
                        <span>-</span> {/* Optional separator */}
                        <input
                          type="number"
                          name="lineUp.expectedCTCThousand"
                          placeholder="Thousands"
                          value={formData.lineUp.expectedCTCThousand}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Education
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faGraduationCap}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="lineUp.qualification"
                          placeholder="Education"
                          value={formData.lineUp.qualification}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Job Designation
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="jobDesignation"
                          placeholder="Designation"
                          value={formData.jobDesignation}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Current Location
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="applicant-form-icons"
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
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Preferred Location
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faMapMarkerAlt}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="lineUp.preferredLocation"
                          placeholder="Preferred Location"
                          value={formData.lineUp.preferredLocation}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Applicant's Notice Period
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="lineUp.noticePeriod"
                          placeholder="Notice Period In Days"
                          value={formData.lineUp.noticePeriod}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Availability For Interview
                      </label>
                      <div className="input-icon-date-picker">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="applicant-form-icons-date"
                        />
                        <DatePicker
                          fullWidth
                          sx={{ border: 0, width: "100%" }}
                          value={formData.availabilityForInterview}
                          onChange={(newValue) => {
                            handleChange({
                              target: {
                                name: "lineUp.availabilityForInterview",
                                value: newValue,
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                sx: {
                                  border: "none",
                                },
                              }}
                              sx={{
                                ".MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    border: "1px solid",
                                    borderWidth: "0",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Expected Joining Date
                      </label>
                      <div className="input-icon-date-picker">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="applicant-form-icons-date"
                        />
                        <DatePicker
                          fullWidth
                          sx={{ border: 0, width: "100%" }}
                          value={formData.expectedJoinDate}
                          onChange={(newValue) => {
                            handleChange({
                              target: {
                                name: "lineUp.expectedJoinDate",
                                value: newValue,
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                sx: {
                                  border: "none",
                                },
                              }}
                              sx={{
                                ".MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    border: "none",
                                    borderWidth: "0",
                                  },
                                },
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Total Experience (Years)
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="applicant-form-icons"
                        />
                        <input
                          type="number"
                          name="lineUp.experienceYear"
                          placeholder="Total Experience (Years)"
                          value={formData.lineUp.experienceYear}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Relevant Experience
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faBriefcase}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="lineUp.relevantExperience"
                          placeholder="Relevant Experience"
                          value={formData.lineUp.relevantExperience}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">Gender</label>
                      <div>
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
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Are You Holding Any Offer?
                      </label>
                      <div className="input-icon-date">
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
                  </div>

                  {formData.lineUp.holdingAnyOffer && (
                    <div className="offer-details">
                      <div className="applicant-form-row">
                        <div className="inside-form-sub-div">
                          <label className="aplicant-form-label">
                            Offer Company Name
                          </label>
                          <input
                            type="text"
                            name="lineUp.companyName"
                            placeholder="company Name"
                            value={formData.lineUp.companyName}
                            onChange={handleChange}
                            required
                            className="form-textfield"
                          />
                        </div>
                        <div className="inside-form-sub-div">
                          <label className="aplicant-form-label">
                            Offer Salary (Lakh)
                          </label>
                          <input
                            type="number"
                            name="lineUp.offersalary"
                            placeholder="Salary (Lakh)"
                            value={formData.lineUp.offersalary}
                            onChange={handleChange}
                            required
                            className="form-textfield"
                          />
                        </div>
                      </div>
                      <div className="applicant-form-row">
                        <div className="inside-form-sub-div">
                          <label className="aplicant-form-label">
                            Offer Details
                          </label>
                          <textarea
                            name="lineUp.offerdetails"
                            placeholder="Details about the offer"
                            value={formData.lineUp.offerdetails}
                            onChange={handleChange}
                            rows="4"
                            className="form-textfield"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        Have You Done Any Courses and Certificates?
                      </label>
                      <div className="applicant-form-input-icon">
                        <FontAwesomeIcon
                          icon={faCertificate}
                          className="applicant-form-icons"
                        />
                        <input
                          type="text"
                          name="lineUp.sslCertificates"
                          placeholder="SSL Certificates"
                          value={formData.lineUp.sslCertificates}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="submit-form-row">
      <div className="submit-file-area">
        <div className="applicant-file-label">
          <label htmlFor="resumeUpload">Upload Resume</label>
          {resumeSelected && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "green", marginLeft: "8px" }}
            />
          )}
        </div>
        <div className="applicant-file-div">
          <input
            type="file"
            id="resumeUpload"
            name="lineUp.resume"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
          
          />
          <label htmlFor="resumeUpload" className="custom-file-upload">
            Choose File
          </label>
        </div>
      </div>

      <div className="submit-file-area">
        <div className="applicant-file-label">
          <label htmlFor="photoUpload">Upload Photo</label>
          {photoSelected && (
            <FontAwesomeIcon
              icon={faCheckCircle}
              style={{ color: "green", marginLeft: "8px" }}
            />
          )}
        </div>
        <div className="applicant-file-div">
          <input
            type="file"
            id="photoUpload"
            name="lineUp.photo"
            onChange={handleChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <label htmlFor="photoUpload" className="custom-file-upload">
            Choose File
          </label>
        </div>
      </div>
    </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        What motivated you to apply for this position?
                      </label>
                      <textarea
                        name="questions[0].question1"
                        className="form-textfield"
                        placeholder="Your motivation for applying"
                        value={formData.questions[0].question1}
                        onChange={handleChange}
                        rows="4"
                        required
                      />
                    </div>
                  </div>
                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        How do you prioritize your tasks when working on
                        multiple projects?
                      </label>
                      <textarea
                        className="form-textfield"
                        name="questions[0].question2"
                        placeholder="Your approach to prioritization"
                        value={formData.questions[0].question2}
                        onChange={handleChange}
                        rows="4"
                        required
                      />
                    </div>
                  </div>

                  <div className="applicant-form-row">
                    <div className="inside-form-sub-div">
                      <label className="aplicant-form-label">
                        How do you prioritize your tasks when working on
                        multiple projects?
                      </label>
                      <textarea
                        className="form-textfield"
                        name="questions[0].question3"
                        placeholder="Your approach to deadline management"
                        value={formData.questions[0].question3}
                        onChange={handleChange}
                        rows="4"
                        required
                      />
                    </div>
                  </div>

<div className="setFormButtonsDiv">
                  {/* <div className="submit-div">
                    <button className="submit-button" type="hyperlink">
                      Aptitude Test
                    </button>
                  </div> */}

                  <div className="submit-div">
                    <button className="applicant-submit-button" type="submit">
                      Submit
                    </button>
                  </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default ApplicantForm;
