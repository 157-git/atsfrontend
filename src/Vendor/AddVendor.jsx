import React, { useState } from 'react';
import './AddVendor.css';

const AddVendor = () => {
    const [errors, setErrors] = useState({});
    const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    vendorName: '',
    dateOfJoining: '',
    designation: '',
    department: '',
    officialMail: '',
    vendorEmail: '',
    officialContactNumber: '',
    alternateContactNo: '',
    dateOfBirth: '',
    gender: '',
    companyMobileNumber: '',
    whatsAppNumber: '',
    emergencyContactPerson: '',
    emergencyContactNumber: '',
    emergencyPersonRelation: '',
    vendorPresentAddress: '',
    vendorExperience: '',
    perks: '',
    maritalStatus: '',
    anniversaryDate: '',
    tshirtSize: '',
    lastCompany: '',
    workLocation: '',
    entrySource: '',
    vendorStatus: '',
    lastWorkingDate: '',
    reasonForLeaving: '',
    inductionYesOrNo: '',
    inductionComment: '',
    trainingSource: '',
    trainingCompletedYesOrNo: '',
    trainingTakenCount: '',
    roundsOfInterview: '',
    interviewTakenPerson: '',
    warningComments: '',
    performanceIndicator: '',
    teamLeaderMsg: '',
    editDeleteAuthority: '',
    linkedInURL: '',
    faceBookURL: '',
    twitterURL: '',
    vendorAddress: '',
    bloodGroup: '',
    aadhaarNo: '',
    panNo: '',
    educationalQualification: '',
    offeredSalary: '',
    jobRole: '',
    professionalPtNo: '',
    esIcNo: '',
    pfNo: '',
    insuranceNumber: '',
    reportingMangerName: '',
    reportingMangerDesignation: '',
    vendorPassword: '',
    confirmPassword: '',
    oldTeamLeaderId: 0,
    documents: '',
    resumeFile: '',
    teamLeaderVendorId: 434
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const showPassword = () => setPasswordVisible(true);
  const hidePassword = () => setPasswordVisible(false);
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      if (
        name === "vendorName" ||
        name === "designation" ||
        name === "department" ||
        name === "perks" ||
        name === "lastCompany" ||
        name === "workLocation" ||
        name === "entrySource" ||
        name === "reasonForLeaving" ||
        name === "inductionComment" ||
        name === "trainingSource" ||
        name === "emergencyContactPerson" ||
        name === "emergencyPersonRelation" ||
        name === "interviewTakenPerson" ||
        name === "warningComments" ||
        name === "performanceIndicator" ||
        name === "teamLeaderMsg" ||
        name === "editDeleteAuthority" ||
        name === "bloodGroup" ||
        name === "educationalQualification" ||
        name === "reportingMangerName" ||
        name === "reportingMangerDesignation"
      ) {
        if (/\d/.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Please enter character value only.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
          }));
        }
      } else if (
        name === "employeeNumber" ||
        name === "officialContactNumber" ||
        name === "alternateContactNo" ||
        name === "companyMobileNumber" ||
        name === "whatsAppNumber" ||
        name === "emergencyContactNumber" ||
        name === "insuranceNumber" ||
        name === "aadhaarNo" ||
        name === "offeredSalary" ||
        name === "trainingTakenCount" ||
        name === "professionalPtNo" ||
        name === "esIcNo" ||
        name === "pfNo" ||
        name === "roundsOfInterview"
      ) {
        if (/[^0-9]/.test(value)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "Please enter numeric value only.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
          }));
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
          }));
        }
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    }
  };
  const handleConfirmPasswordBlur = () => {
    if (formData.employeePassword !== formData.confirmPassword) {
      setPasswordMatch(false);
      setPasswordError("Passwords do not match");
    } else {
      setPasswordMatch(true);
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // handle form submission logic
  };

  return (
    <div className="AddRec-form-container">
    <form
      className="AddRec-form-group"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="addRec-form-row">
        <label>Vendor Name:</label>
        <input
          type="text"
          name="vendorName"
          className="employee-inputs"
          placeholder="Enter Vendor Full Name"
          value={formData.vendorName}
          onChange={handleInputChange}
        />
        {errors.employeeName && (
          <div className="error">{errors.employeeName}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Date of Joining:</label>
        <input
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Designation:</label>
        <input
          type="text"
          name="designation"
          placeholder="Eg: FrontEnd Developer"
          value={formData.designation}
          onChange={handleInputChange}
        />
        {errors.designation && (
          <div className="error">{errors.designation}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Department:</label>
        <input
          type="text"
          name="department"
          placeholder="Enter Department"
          value={formData.department}
          onChange={handleInputChange}
        />
        {errors.department && (
          <div className="error">{errors.department}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Job Role:</label>
        <select
          name="jobRole"
          value={formData.jobRole}
          onChange={handleInputChange}
        >
          <option value="">Select Job Role</option>
          <option value="Team Leader">Team Leader</option>
          <option value="Admin">Admin</option>
          <option value="Senior Recruiter">Senior Recruiter</option>
          <option value="Recruiter">recruiter</option>
        </select>
      </div>

      <div className="addRec-form-row">
        <label>Official Email:</label>
        <input
          type="email"
          name="officialMail"
          placeholder="Enter Official Email"
          value={formData.officialMail}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Personal Email:</label>
        <input
          type="email"
          name="vendorEmail"
          placeholder="Enter Employee Email"
          value={formData.vendorEmail}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Mobile Number:</label>
        <input
          type="text"
          name="employeeNumber"
          placeholder="Enter Mobile Number"
          value={formData.employeeNumber}
          onChange={handleInputChange}
        />
        {errors.employeeNumber && (
          <div className="error">{errors.employeeNumber}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Alternate Mobile Number:</label>
        <input
          type="text"
          accept="0-9"
          name="alternateContactNo"
          placeholder="Enter Alternate Mobile Number"
          value={formData.alternateContactNo}
          onChange={handleInputChange}
        />
        {errors.alternateContactNo && (
          <div className="error">{errors.alternateContactNo}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Official Contact Number:</label>
        <input
          type="text"
          accept="0-9"
          name="officialContactNumber"
          placeholder="Enter Company Mobile Number"
          value={formData.officialContactNumber}
          onChange={handleInputChange}
        />
        {errors.officialContactNumber && (
          <div className="error">{errors.officialContactNumber}</div>
        )}
      </div>
      <div className="addRec-form-row">
        <label>Company Mobile Number:</label>
        <input
          type="text"
          accept="0-9"
          name="companyMobileNumber"
          placeholder="Enter Company Mobile Number"
          value={formData.companyMobileNumber}
          onChange={handleInputChange}
        />
        {errors.companyMobileNumber && (
          <div className="error">{errors.companyMobileNumber}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>WhatsApp Number:</label>
        <input
          type="text"
          accept="0-9"
          name="whatsAppNumber"
          placeholder="Enter WhatsApp Number"
          value={formData.whatsAppNumber}
          onChange={handleInputChange}
        />
        {errors.whatsAppNumber && (
          <div className="error">{errors.whatsAppNumber}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="addRec-form-row">
        <label>Marital Status:</label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleInputChange}
        >
          <option value={""}>Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      <div className="addRec-form-row">
        <label>Anniversary Date:</label>
        <input
          type="date"
          name="anniversaryDate"
          value={formData.anniversaryDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Emergency Contact Person:</label>
        <input
          type="text"
          name="emergencyContactPerson"
          placeholder="Enter Emergency Contact Person Name"
          value={formData.emergencyContactPerson}
          onChange={handleInputChange}
        />
        {errors.emergencyContactPerson && (
          <div className="error">{errors.emergencyContactPerson}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Emergency Contact Number:</label>
        <input
          type="text"
          name="emergencyContactNumber"
          placeholder="Enter Emergency Contact Number"
          value={formData.emergencyContactNumber}
          onChange={handleInputChange}
        />
        {errors.emergencyContactNumber && (
          <div className="error">{errors.emergencyContactNumber}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label> Relation With Person:</label>
        <input
          type="text"
          name="emergencyPersonRelation"
          placeholder="Enter Emergency Person Relation"
          value={formData.emergencyPersonRelation}
          onChange={handleInputChange}
        />
        {errors.emergencyPersonRelation && (
          <div className="error">{errors.emergencyPersonRelation}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>T-shirt Size:</label>
        <select
          name="tshirtSize"
          value={formData.tshirtSize}
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
      </div>
      <div className="addRec-form-row">
        <label>Aadhaar Number:</label>
        <input
          type="text"
          name="aadhaarNo"
          placeholder="Enter Aadhaar Number"
          value={formData.aadhaarNo}
          onChange={handleInputChange}
        />
        {errors.aadhaarNo && <div className="error">{errors.aadhaarNo}</div>}
      </div>

      <div className="addRec-form-row">
        <label>PAN Card Number:</label>
        <input
          type="text"
          name="panNo"
          placeholder="Enter PAN Card Number"
          value={formData.panNo}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Educational Qualification:</label>
        <input
          type="text"
          name="educationalQualification"
          placeholder="Enter Educational Qualification"
          value={formData.educationalQualification}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Gross Salary:</label>
        <input
          type="text"
          name="offeredSalary"
          placeholder="Enter Gross Salary"
          value={formData.offeredSalary}
          onChange={handleInputChange}
        />
        {errors.offeredSalary && (
          <div className="error">{errors.offeredSalary}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Employee Present Address:</label>
        <input
          type="text"
          name="vendorPresentAddress"
          placeholder="Enter Present Address"
          value={formData.vendorPresentAddress}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Employee Experience:</label>
        <input
          type="text"
          name="vendorExperience"
          placeholder="Enter Experience"
          value={formData.vendorExperience}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Perks:</label>
        <input
          type="text"
          name="perks"
          placeholder="Enter Perks"
          value={formData.perks}
          onChange={handleInputChange}
        />
        {errors.perks && <div className="error">{errors.perks}</div>}
      </div>

      <div className="addRec-form-row">
        <label>Last Company:</label>
        <input
          type="text"
          name="lastCompany"
          placeholder="Enter Last Company"
          value={formData.lastCompany}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Work Location:</label>
        <input
          type="text"
          name="workLocation"
          placeholder="Enter Work Location"
          value={formData.workLocation}
          onChange={handleInputChange}
        />
        {errors.workLocation && (
          <div className="error">{errors.workLocation}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Entry Source:</label>
        <input
          type="text"
          name="entrySource"
          placeholder="Enter Entry Source"
          value={formData.entrySource}
          onChange={handleInputChange}
        />
        {errors.entrySource && (
          <div className="error">{errors.entrySource}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Employee Status:</label>
        <select
          name="vendorStatus"
          value={formData.vendorStatus}
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
          name="reasonForLeaving"
          placeholder="Enter Reason for Leaving"
          value={formData.reasonForLeaving}
          onChange={handleInputChange}
        />
        {errors.reasonForLeaving && (
          <div className="error">{errors.reasonForLeaving}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Induction (Yes/No):</label>
        <select
          name="inductionYesOrNo"
          value={formData.inductionYesOrNo}
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
          name="inductionComment"
          placeholder="Enter Induction Comment"
          value={formData.inductionComment}
          onChange={handleInputChange}
        />
        {errors.inductionComment && (
          <div className="error">{errors.inductionComment}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Training Source:</label>
        <input
          type="text"
          name="trainingSource"
          placeholder="Enter Training Source"
          value={formData.trainingSource}
          onChange={handleInputChange}
        />
        {errors.trainingSource && (
          <div className="error">{errors.trainingSource}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Training Completed (Yes/No):</label>
        <select
          name="trainingCompletedYesOrNo"
          value={formData.trainingCompletedYesOrNo}
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
          name="trainingTakenCount"
          placeholder="Enter Training Taken Count"
          value={formData.trainingTakenCount}
          onChange={handleInputChange}
        />
        {errors.trainingTakenCount && (
          <div className="error">{errors.trainingTakenCount}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Rounds of Interview:</label>
        <input
          type="text"
          name="roundsOfInterview"
          placeholder="Enter Rounds of Interview"
          value={formData.roundsOfInterview}
          onChange={handleInputChange}
        />
        {errors.roundsOfInterview && (
          <div className="error">{errors.roundsOfInterview}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Interview Taken By:</label>
        <input
          type="text"
          name="interviewTakenPerson"
          placeholder="Enter Interview Taken By"
          value={formData.interviewTakenPerson}
          onChange={handleInputChange}
        />
        {errors.interviewTakenPerson && (
          <div className="error">{errors.interviewTakenPerson}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Warning Comments:</label>
        <input
          type="text"
          name="warningComments"
          placeholder="Enter Warning Comments"
          value={formData.warningComments}
          onChange={handleInputChange}
        />
        {errors.warningComments && (
          <div className="error">{errors.warningComments}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Performance Indicator:</label>
        <input
          type="text"
          name="performanceIndicator"
          placeholder="Enter Performance Indicator"
          value={formData.performanceIndicator}
          onChange={handleInputChange}
        />
        {errors.performanceIndicator && (
          <div className="error">{errors.performanceIndicator}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Team Leader Message:</label>
        <input
          type="text"
          name="teamLeaderMsg"
          placeholder="Enter Team Leader Message"
          value={formData.teamLeaderMsg}
          onChange={handleInputChange}
        />
        {errors.teamLeaderMsg && (
          <div className="error">{errors.teamLeaderMsg}</div>
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
          name="linkedInURl"
          placeholder="Enter LinkedIn URL"
          value={formData.linkedInURl}
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
          name="twitterURl"
          placeholder="Enter Twitter URL"
          value={formData.twitterURl}
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Vendor Address:</label>
        <input
          type="text"
          name="vendorAddress"
          placeholder="Enter Vendor Address"
          value={formData.employeeAddress}
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
          name="insuranceNumber"
          placeholder="Enter Insurance Number"
          value={formData.insuranceNumber}
          onChange={handleInputChange}
        />
        {errors.insuranceNumber && (
          <div className="error">{errors.insuranceNumber}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Reporting Manager Name:</label>
        <input
          type="text"
          name="reportingMangerName"
          placeholder="Enter Reporting Manager Name"
          value={formData.reportingMangerName}
          onChange={handleInputChange}
        />
        {errors.reportingMangerName && (
          <div className="error">{errors.reportingMangerName}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Reporting Manager Designation:</label>
        <input
          type="text"
          name="reportingMangerDesignation"
          placeholder="Enter Reporting Manager Designation"
          value={formData.reportingMangerDesignation}
          onChange={handleInputChange}
        />
        {errors.reportingMangerDesignation && (
          <div className="error">{errors.reportingMangerDesignation}</div>
        )}
      </div>
      <div className="addRec-form-row">
        <label>Upload Resume:</label>
        <input type="file" 
        multiple
        name="resumeFile" onChange={handleInputChange} />
      </div>
      <div className="addRec-form-row">
        <label>Upload Profile Image:</label>
        <input
          type="file"
          name="profileImage"
          onChange={handleInputChange}
        />
      </div>

      <div className="addRec-form-row">
        <label>Upload Document:</label>
        <input type="file" 
        multiple
        name="document" onChange={handleInputChange} />
      </div>
     
      <div className="addRec-form-row">
        <label>Password:</label>

      <div class="wrapper-eye">
        <div className="password-eye-icon"
           onMouseEnter={showPassword}
           onMouseLeave={hidePassword}> 
        <i className="fas fa-eye"></i>
        </div>
          <input
            type={passwordVisible ? "text" : "password"}
            name="vendorPassword"
            placeholder="Enter Password"
            value={formData.vendorPassword}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="addRec-form-row">
        <label>Team Leader Id:</label>
        <input
          type="text"
          name="reportingMangerName"
          placeholder="Enter Reporting Manager Name"
          value={formData.reportingMangerName}
          onChange={handleInputChange}
        />
        {errors.reportingMangerName && (
          <div className="error">{errors.reportingMangerName}</div>
        )}
      </div>

      <div className="addRec-form-row">
        <label>Confirm Password:</label>
        <div class="wrapper-eye">
        <div className="password-eye-icon"
        onMouseEnter={showPassword}
        onMouseLeave={hidePassword}> 
        <i className="fas fa-eye"></i>
        </div>
        <input
          type={passwordVisible ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleConfirmPasswordBlur}
        />
        </div>

        {!passwordMatch && <div className="error">{passwordError}</div>}
      </div>

      <div className="add-employee-submit-div">
        <button type="submit" className="submit-button-add-emp">
          Submit
        </button>
      </div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
    </form>
  </div>
  );
};

export default AddVendor;

