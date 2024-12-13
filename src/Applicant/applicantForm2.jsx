// This is done by vaibhavi kawarkhe Date: 10-12-2024
// Task: Applicant Form
import React, { useRef, useState, useEffect } from "react";
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
import "./applicantFrom2.css";
import { API_BASE_URL } from "../api/api";

function ApplicantForm2({ loginEmployeeName }) {
  //Arshad Attar Added This Code On 12-12-2024
  //This Code to hide Employee Id and UserType In Every Time
  const { encodedParams } = useParams();
  // Decode the encodedParams
  const decodeParams = (encoded) => {
    try {
      const decoded = atob(encoded);
      const [employeeId, userType] = decoded.split(":");
      return { employeeId, userType };
    } catch (error) {
      console.error("Failed to decode parameters:", error);
      return { employeeId: null, userType: null };
    }
  };
  const { employeeId, userType } = decodeParams(encodedParams);

  console.log("Decoded Employee ID:", employeeId);
  console.log("Decoded User Type:", userType);

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
  const navigator = useNavigate();

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
          [questionKey]: e.target.type === "file" ? files[0] : e.target.value,
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
          [nestedField]: e.target.type === "file" ? files[0] : e.target.value,
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

    // Check for required fields
    const requiredFields = [
      "candidateName",
      "contactNumber",
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
    ];

    const isFormValid = requiredFields.every((field) => {
      const value = field.includes(".")
        ? getNestedValue(formData, field)
        : formData[field];
      return value && value.toString().trim() !== "";
    });

    if (!isFormValid) {
      toast.error("Please fill all required fields");
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
        // Convert resume and photo to base64 if they exist
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
      //toast.success("Your Details Submitted Successfully");
      // Set submitted state to true
      setIsSubmitted(true);
      navigator("/thank-you");
      // Optional: Reset form after a delay or keep thank you message
      setTimeout(() => {
        setFormData(initialFormData);
        setResumeSelected(false);
        setPhotoSelected(false);
        setIsSubmitted(false);
      }, 3000); // Reset after 3 seconds
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit details");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get nested object values
  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, part) => {
      if (part.includes("[")) {
        const [arrKey, index] = part.replace("]", "").split("[");
        return acc[arrKey] ? acc[arrKey][index] : undefined;
      }
      return acc && acc[part];
    }, obj);
  }

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
                  required
                />
              </div>
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
                  required
                />
              </div>
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
                  required
                />
              </div>
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
                  required
                />
                <span></span> {/* Optional separator */}
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
                  required
                />
                <span></span> {/* Optional separator */}
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
                  required
                />
              </div>
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
                  required
                />
              </div>
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
                />
              </div>
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
                />
              </div>
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
            </div>

            <div className="form-group-December">
              <label>Total Experience(Years)</label>
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
                  required
                />
              </div>
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
                />
              </div>
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
                      required
                      className="form-textfield"
                    />
                  </div>
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
                      required
                      className="form-textfield"
                    />
                  </div>
                </div>
                <br></br>

                <div className="form-group-December">
                  <label>Offer Details</label>
                  <textarea
                    name="lineUp.offerdetails"
                    placeholder="Details about the offer"
                    value={formData.lineUp.offerdetails}
                    onChange={handleChange}
                    rows="6"
                    className="form-textfield"
                  />
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
                />
              </div>
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
            </div>

            <div className="form-group-December">
              <label>What Motivated You To Apply For This Position ? </label>
              <textarea
                name="questions[0].question1"
                className="form-textfield"
                placeholder="Your motivation for applying"
                value={formData.questions[0].question1}
                onChange={handleChange}
                rows="6"
                required
              />
            </div>

            <div className="form-group-December">
              <label>
                How you Prioritize Your Task When Working On Multiple Projects ?
              </label>
              <textarea
                className="form-textfield"
                name="questions[0].question3"
                placeholder="Your approach to deadline management"
                value={formData.questions[0].question3}
                onChange={handleChange}
                rows="6"
                required
              />
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
                  accept=".pdf,.doc,.docx"
                />
                {photoSelected && (
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="success-December"
                  />
                )}
                <br></br>
              </div>
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
