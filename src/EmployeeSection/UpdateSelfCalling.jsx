import React, { useState, useEffect } from "react";
// import "../EmployeeSection/CallingTrackerForm.css";
import { useParams } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "../EmployeeSection/UpdateSelfCalling.css"
import { API_BASE_URL } from "../api/api";

const UpdateCallingTracker = ({ initialData, candidateId, showLastComponenet }) => {
  const [isOtherEducationSelected, setIsOtherEducationSelected] =
    useState(false);
  const [callingTracker, setCallingTracker] = useState({
    date: new Date().toISOString().slice(0, 10),
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

    lineUp: {
      companyName: "",
      experienceYear: "",
      experienceMonth: "",
      relevantExperience: "",
      currentCtCLakh: "",
      currentCtCThousand: "",
      expectedCtCLakh: "",
      expectedCtCThousand: "",
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

  const { employeeId } = useParams();
  console.log(employeeId + "Id In Update Form....");
  console.log(candidateId + "Candidate Id In Update Form...");

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [recruiterName, setRecruiterName] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [candidateFetched, setCandidateFetched] = useState(initialData);
  const [showAlert, setShowAlert] = useState(false);
  const [requirementOptions, setRequirementOptions] = useState([]);

  useEffect(() => {
    fetchEmployeeName();
    fetchCandidateData(candidateId);
    fetchRequirementOptions();
  }, [candidateId]);

  useEffect(() => {
    if (initialData) {
      setCallingTracker(initialData);
      setRecruiterName(initialData.recruiterName);
      setCandidateFetched(true);
    }
  }, [initialData]);

  const fetchEmployeeName = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employeeName/${newCandidateId}`
      );
      const data = await response.text();
      setRecruiterName(data);
    } catch (error) {
      console.error("Error fetching employee name:", error);
    }
  };

  const fetchCandidateData = async (candidateId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/specific-data/${candidateId}`
      );
      const data = await response.json();
      setCallingTracker(data);
      setCandidateFetched(true);
    } catch (error) {
      console.error("Error fetching candidate data:", error);
    }
  };

  const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/company-details`
      );
      const { data } = response;
      setRequirementOptions(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("lineUp")) {
      setCallingTracker((prevState) => ({
        ...prevState,
        lineUp: { ...prevState.lineUp, [name.split(".")[1]]: value },
      }));
    } else {
      setCallingTracker((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleEducationChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsOtherEducationSelected(true);
      setCallingTracker({ ...callingTracker, currentEducation: "" });
    } else {
      setIsOtherEducationSelected(false);
      setCallingTracker({ ...callingTracker, currentEducation: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToUpdate = {
        ...callingTracker,
        recruiterName: recruiterName,
      };

      const response = await fetch(
        `${API_BASE_URL}/update-calling-data/${candidateId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToUpdate),
        }
      );

      console.log(candidateId + "  candidateId  in updated method.. After  ");
      if (response.ok) {
        const data = await response.text();
        toast.success("Data updated successfully:");
        setFormSubmitted(true);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setFormSubmitted(false);
        }, 4000);
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      toast.error("Error updating data:", error);
    }
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
  };




  //neha_updateselfcalling_designing_start_lineno_205_date_16/07/24
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
                  value={callingTracker.candidateAddedTime}
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
              </div>
            </div>
          </div>
          <div hidden>
            <input type="text" name="employeeId" value={employeeId} readOnly />
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Candidate's Full Name</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="candidateName"
                  className={`plain-input`}
                  value={callingTracker?.candidateName}
                  onChange={handleChange}

                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Candidate's Email</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="email"
                  name="candidateEmail"
                  value={callingTracker?.candidateEmail}
                  onChange={handleChange}
                  className={`plain-input`}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Contact Number</label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  name="contactNumber"
                  value={callingTracker?.contactNumber}
                  onChange={handleChange}
                  required={callingTracker.selectYesOrNo !== "Interested"}
                  defaultCountry="IN"
                  maxLength={11}
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Whatsapp Number</label>
              <div className="update-calling-tracker-field-sub-div">
                <input

                  placeholder="Enter phone number"
                  name="alternateNumber"
                  value={callingTracker.alternateNumber}
                  onChange={handleChange}
                  required={callingTracker.selectYesOrNo !== "Interested"}
                  defaultCountry="IN"
                  maxLength={11}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Source Name</label>
              <div className="update-calling-tracker-field-sub-div">
                <select
                  name="sourceName"
                  className={`plain-input`}
                  value={callingTracker.sourceName}
                  onChange={handleChange}
                  required={callingTracker.selectYesOrNo !== "Interested"}
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
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Job Id</label>
              <div className="update-calling-tracker-two-input-container">
                <select
                  className="update-calling-tracker-two-input"
                  id="requirementId"
                  name="requirementId"
                  value={callingTracker?.requirementId}
                  onChange={handleRequirementChange}
                  required={callingTracker.selectYesOrNo === "Interested"}
                >
                  <option value="">Select Job Id</option>
                  {requirementOptions.map((option) => (
                    <option
                      key={option.requirementId}
                      value={option.requirementId}
                    >
                      {option.requirementId}
                    </option>
                  ))}
                </select>

                <input
                  placeholder=" Your Incentive"
                  value={callingTracker?.incentive}
                  readOnly
                  className="update-calling-tracker-two-input"
                  type="text"
                />
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
                  value={callingTracker?.jobDesignation}
                  // readOnly
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Company"
                  id="requirementCompany"
                  name="requirementCompany"
                  value={callingTracker?.requirementCompany}
                  // readOnly
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Current Location</label>
              <div className="update-calling-check-box-main-container">
                <select
                  name="currentLocation"
                  value={callingTracker.currentLocation}
                  onChange={handleChange}
                >
                  <option value="" style={{ color: "gray" }}>
                    Select Location
                  </option>
                  <option value="Pune City">Pune City</option>
                  <option value="PCMC">PCMC</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  name="fullAddress"
                  placeholder="Full Address"
                  value={callingTracker?.fullAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="update-calling-tracker-row-white">
            <div className="update-calling-tracker-field">
              <label>Calling Remark</label>
              <div className="update-calling-tracker-field-sub-div">
                <select
                  required={callingTracker.selectYesOrNo === "Interested"}
                  className="plain-input"
                  name="feedBack"
                  value={callingTracker.feedBack}
                  onChange={handleChange}
                >
                  <option value="">Feedback</option>
                  <option value="Call Done">Call Done</option>
                  <option value="Asked for Call Back">Asked for Call Back</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Network Issue">Network Issue</option>
                  <option value="Invalid Number">Invalid Number</option>
                  <option value="Need to call back">Need to call back</option>
                  <option value="Do not call again">Do not call again</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Date Of Birth</label>
              <div className="update-calling-check-box-main-container">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={callingTracker.dateOfBirth}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                />

                <div className="calling-check-box-container">
                  <div className="update-callingTracker-male-div">
                    <div className="calling-check-box">
                      <input
                        type="checkbox"
                        name="gender"
                        className="gender"
                        checked={callingTracker.gender === "Male"}
                        onChange={handleChange}
                      />

                    </div>
                    <div>Male</div>
                  </div>
                  <div className="update-callingTracker-male-div">

                    <div className="calling-check-box">
                      <input
                        type="checkbox"
                        name="female"
                        value="female"
                        className="gender"
                        checked={callingTracker.gender === "Female"}
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
                  name="msgForTeamLeader"
                  placeholder="Enter Call Summary"
                  value={callingTracker.msgForTeamLeader}
                  onChange={handleChange}
                  className="plain-input"
                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Education</label>
              <div className="update-calling-tracker-two-input-container">
                {!isOtherEducationSelected ? (
                  <select
                    name="qualification"
                    style={{
                      height: "30px",
                      width: "100%",
                      alignItems: "center",
                      lineHeight: 1,
                      marginRight: "10px",
                      color: "gray"
                    }}
                    value={callingTracker.qualification}
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
                    <option value="Bachelor's Degrees">Bachelor's Degrees</option>
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
                    <option value="Juris Doctor (JD)">Juris Doctor (JD)</option>
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
                    <option value="Diploma in Nursing">Diploma in Nursing</option>
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
                  </select>
                ) : (
                  <input
                    type="text"
                    name="education"
                    value={callingTracker.qualification}
                    onChange={handleChange}
                  />
                )}
                <input
                  type="text"
                  name="yearOfPassing"
                  placeholder="YOP"
                  value={callingTracker.yearOfPassing}
                  required={callingTracker.selectYesOrNo === "Interested"}
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
                  name="extraCertification"
                  value={callingTracker.extraCertification}
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
                  name="companyName"
                  placeholder="Current Company"
                  value={callingTracker.companyName}
                  onChange={handleChange}
                  required={callingTracker.selectYesOrNo === "Interested"}
                  className="plain-input"

                />
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Total Experience</label>
              <div
                className="update-calling-tracker-two-input-container"
                required={callingTracker.selectYesOrNo === "Interested"}
              >

                <input
                  type="text"
                  name="experienceYear"
                  value={callingTracker.experienceYear}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Years"
                  maxLength="2"
                />
                <div className="calling-tracker-two-input">
                  <input
                    type="number"
                    name="experienceMonth"
                    onChange={handleChange}
                    value={callingTracker.experienceMonth}
                    placeholder="Months"
                    maxLength="2"
                    min="1"
                    max="12"
                  />
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
                    name="relevantExperience"
                    value={callingTracker.relevantExperience}
                    onChange={handleChange}
                    placeholder="Enter Relevant Experience"
                    required={callingTracker.selectYesOrNo === "Interested"}
                  />
                </div>
                <div className="update-calling-tracker-two-input">
                  <input
                    type="text"
                    name="noticePeriod"
                    placeholder="Notice Period"
                    value={callingTracker.noticePeriod}
                    onChange={handleChange}
                    min="0"
                    max="90"
                    required={callingTracker.selectYesOrNo === "Interested"}
                  />
                </div>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Communication Rating </label>
              <div className="update-calling-tracker-field-sub-div">
                <input
                  type="text"
                  name="communicationRating"
                  value={callingTracker.communicationRating}
                  onChange={handleChange}
                  className="plain-input"
                  placeholder="Enter Communication Rating"
                  required={callingTracker.selectYesOrNo === "Interested"}
                />
              </div>
            </div>
          </div>
          <div className="update-calling-tracker-row-gray">
            <div className="update-calling-tracker-field">
              <label>Current CTC(LPA)</label>
              <div
                className="update-calling-tracker-two-input-container"
                required={callingTracker.selectYesOrNo === "Interested"}
              >
                <input
                  type="text"
                  name="currentCtCLakh"
                  value={callingTracker.currentCtCLakh}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Lakh"
                  maxLength="2"
                  pattern="\d*"
                />
                <input
                  type="text"
                  name="currentCtCThousand"
                  value={callingTracker.currentCtCThousand}
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
              <div
                className="update-calling-tracker-two-input-container"
                required={callingTracker.selectYesOrNo === "Interested"}
              >
                <input
                  type="text"
                  name="expectedCtCLakh"
                  value={callingTracker.expectedCtCLakh}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                  placeholder="Lakh"
                  maxLength="2"
                  pattern="\d*"
                />
                <input
                  type="text"
                  name="expectedCtCThousand"
                  value={callingTracker.expectedCtCThousand}
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
                  name="holdingAnyOffer"
                  value={callingTracker.holdingAnyOffer}
                  required={callingTracker.selectYesOrNo === "Interested"}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <input
                  type="text"
                  name="offerLetterMsg"
                  placeholder="Letter Message"
                  value={callingTracker.offerLetterMsg}
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
                  name="msgForTeamLeader"
                  placeholder="Comment For TL"
                  value={callingTracker.msgForTeamLeader}
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
                  required
                  className="update-calling-tracker-two-input"
                  name="selectYesOrNo"
                  placeholder="Candidate Interested"
                  value={callingTracker.selectYesOrNo}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Interested">Interested</option>
                  <option value="No Interested">No Interested</option>
                  <option value="Interested But Not Eligible">
                    Intersted But Not Eligible
                  </option>
                  <option value="Eligible">Eligible</option>
                  <option value="No Interested">No Eligible</option>
                  <option value="Not Eligible But Interested">
                    Not Eligible But Intersted
                  </option>
                </select>
                <select
                  type="text"
                  name="finalStatus"
                  value={callingTracker.finalStatus}
                  onChange={handleChange}
                  required={callingTracker.selectYesOrNo === "Interested"}
                >
                  <option value="">Whats Now</option>
                  <option value="Interview schedule">Interview schedule</option>
                  <option value="Attending After Some time">
                    Attending After Some time
                  </option>
                  <option value="hold">hold</option>
                </select>
              </div>
            </div>
            <div className="update-calling-tracker-field">
              <label>Interview Slots</label>
              <div className="update-calling-tracker-two-input-container">
                <input
                  type="date"
                  name="availabilityForInterview"
                  value={callingTracker.availabilityForInterview}
                  //onChange={handleLineUpChange}
                  onChange={handleChange}
                  className="update-calling-tracker-two-input"
                />
                <input
                  type="time"
                  name="interviewTime"
                  value={callingTracker.interviewTime}
                  onChange={handleChange}
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
          <button className="ctf-btn" onClick={showLastComponenet} id="uploadbtn2">
            Cancel
          </button>
        </div>
      </form>

    </div>
  );
};

export default UpdateCallingTracker;
// neha_updateselfcalling_designing_end_lineno_1214_date_16/07/24
