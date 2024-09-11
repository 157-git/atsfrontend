import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/api";

// SwapnilRokade_UpdateEmployee_AutoFeildFunctionality_16/07
const UpdateEmployee = ({ id, userType }) => {
  const [profileImage, setProfileImage] = useState("");
  const [pdfSrc, setPdfSrc] = useState("");
  const [pdf, setPdf] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    dateOfJoining: "",
    designation: "",
    department: "",
    officialMail: "",
    employeeEmail: "",
    officialContactNumber: "",
    alternateContactNo: "",
    dateOfBirth: "",
    gender: "",
    companyMobileNumber: "",
    whatsAppNumber: "",
    emergencyContactPerson: "",
    emergencyContactNumber: "",
    emergencyPersonRelation: "",
    employeePresentAddress: "",
    employeeExperience: "",
    perks: "",
    maritalStatus: "",
    anniversaryDate: "",
    tshirtSize: "",
    lastCompany: "",
    workLocation: "",
    entrySource: "",
    employeeStatus: "",
    lastWorkingDate: "",
    reasonForLeaving: "",
    inductionYesOrNo: "",
    inductionComment: "",
    trainingSource: "",
    trainingCompletedYesOrNo: "",
    trainingTakenCount: "",
    roundsOfInterview: "",
    interviewTakenPerson: "",
    warningComments: "",
    performanceIndicator: "",
    editDeleteAuthority: "",
    linkedInURl: "",
    faceBookURL: "",
    twitterURl: "",
    employeeAddress: "",
    bloodGroup: "",
    aadhaarNo: "",
    panNo: "",
    educationalQualification: "",
    offeredSalary: "",
    jobRole: "",
    professionalPtNo: "",
    esIcNo: "",
    pfNo: "",
    employeePassword: "",
    confirmPassword: "",
    profileImage: null,
    document: null,
    resumeFile: null,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [fileNames, setFileNames] = useState({
    profileImage: "",
    document: "",
    resumeFile: "",
  });

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/fetch-profile-details/${id}/${userType}`
      );
      const initialResponse = response.data;
      console.log(initialResponse);

      let profileImageFile = null;
      let resumeFileFile = null;
      let documentFile = null;

      if (initialResponse.profileImage) {
        const byteCharacters = atob(initialResponse.profileImage);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        const url = URL.createObjectURL(blob);
        setProfileImage(url);
        profileImageFile = new File([blob], "profileImage.jpg", {
          type: "image/jpeg",
        });
      }
      if (initialResponse.resumeFile) {
        const byteCharacters = atob(initialResponse.resumeFile);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);
        setPdfSrc(url);
        resumeFileFile = new File([blob], "resumeFile.pdf", {
          type: "application/pdf",
        });
      }
      if (initialResponse.document) {
        const byteCharacters = atob(initialResponse.document);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = URL.createObjectURL(blob);
        setPdf(url);
        documentFile = new File([blob], "document.pdf", {
          type: "application/pdf",
        });
      }

      // Update form data and file names
      setFormData((prevFormData) => ({
        ...prevFormData,
        employeeId: initialResponse.id || "",
        employeeName: initialResponse.name || "",
        dateOfJoining: initialResponse.dateOfJoining || "",
        designation: initialResponse.designation || "",
        department: initialResponse.department || "",
        jobRole: initialResponse.jobRole || "",
        officialMail: initialResponse.officialMail || "",
        employeeEmail: initialResponse.personalEmailId || "",
        alternateContactNo: initialResponse.alternateContactNo || "",
        companyMobileNumber: initialResponse.companyMobileNo || "",
        officialContactNumber: initialResponse.officialContactNo || "",
        whatsAppNumber: initialResponse.whatsAppNo || "",
        dateOfBirth: initialResponse.dateOfBirth || "",
        gender: initialResponse.gender || "",
        maritalStatus: initialResponse.maritalStatus || "",
        anniversaryDate: initialResponse.anniversaryDate || "",
        emergencyContactNumber: initialResponse.emergencyContactNo || "",
        emergencyContactPerson: initialResponse.emergencyContactPerson || "",
        emergencyPersonRelation: initialResponse.emergencyPersonRelation || "",
        tshirtSize: initialResponse.tshirtSize || "",
        bloodGroup: initialResponse.bloodGroup || "",
        aadhaarNo: initialResponse.aadhaarNo || "",
        panNo: initialResponse.panNo || "",
        educationalQualification: initialResponse.qualification || "",
        offeredSalary: initialResponse.salary || "",
        profileImage: profileImageFile || "",
        document: documentFile || "",
        resumeFile: resumeFileFile || "",
        employeePresentAddress: initialResponse.presentAddress || "",
        employeeExperience: initialResponse.experience || "",
        perks: initialResponse.perks || "",
        lastCompany: initialResponse.lastCompany || "",
        workLocation: initialResponse.workLocation || "",
        entrySource: initialResponse.entrySource || "",
        employeeStatus: initialResponse.status || "",
        lastWorkingDate: formatDate(initialResponse.workingDate) || "",
        reasonForLeaving: initialResponse.reasonForLeaving || "",
        inductionYesOrNo: initialResponse.inductionYesOrNo || "",
        inductionComment: initialResponse.inductionComment || "",
        trainingSource: initialResponse.trainingSource || "",
        trainingCompletedYesOrNo:
          initialResponse.trainingCompletedYesOrNo || "",
        trainingTakenCount: initialResponse.trainingTakenCount || "",
        roundsOfInterview: initialResponse.roundsOfInterview || "",
        interviewTakenPerson: initialResponse.interviewTakenPerson || "",
        warningComments: initialResponse.warningComments || "",
        performanceIndicator: initialResponse.performanceIndicator || "",
        editDeleteAuthority: initialResponse.editDeleteAuthority || "",
        linkedInURl: initialResponse.linkedInURL || "",
        faceBookURL: initialResponse.faceBookURL || "",
        twitterURl: initialResponse.twitterURL || "",
        employeeAddress: initialResponse.address || "",
        professionalPtNo: initialResponse.professionalPtNo || "",
        esIcNo: initialResponse.esIcNo || "",
        pfNo: initialResponse.pfNo || "",
        employeePassword: initialResponse.password || "",
        confirmPassword: initialResponse.confirmPassword || "",
      }));

      setFileNames({
        profileImage: profileImageFile ? profileImageFile.name : "",
        document: documentFile ? documentFile.name : "",
        resumeFile: resumeFileFile ? resumeFileFile.name : "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [name]: files[0].name,
      }));
    }
  };

  const formatDate = (dateString) => {
    let year, month, day;

    if (dateString.includes("/")) {
      // Handle dd/MM/yyyy format
      [day, month, year] = dateString.split("/");
    } else if (dateString.includes("-")) {
      // Handle yyyy-MM-dd format
      [year, month, day] = dateString.split("-");
    } else {
      return "Unsupported date format";
    }

    // Ensure day, month, and year are two digits and four digits respectively
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    const formattedYear = String(year).padStart(4, "0");

    // Construct and return the date in yyyy-MM-dd format
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
  };

  const formatDate1 = (dateString) => {
    const date = new Date(dateString);

    // Ensure month is converted to a zero-based index for Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because getMonth() returns 0-11
    const day = String(date.getDate()).padStart(2, "0");

    // Construct and return the date in yyyy-MM-dd format
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
      setFileNames((prevFileNames) => ({
        ...prevFileNames,
        [name]: files[0].name,
      }));
    } else {
      if (
        name === "employeeName" ||
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
        name === "educationalQualification"
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
        name === "officialContactNumber" ||
        name === "alternateContactNo" ||
        name === "companyMobileNumber" ||
        name === "whatsAppNumber" ||
        name === "emergencyContactNumber" ||
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      setPasswordError("Passwords do not match");
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] instanceof File) {
        formDataToSend.append(key, formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await fetch(
        ` ${API_BASE_URL}/add-employee/432`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );
      if (response) {
        console.log(formData);
        console.log(response);
        setSuccessMessage("Employee Data Added Successfully.");
      } else {
        setSuccessMessage(data.message || "Failed to add employee data.");
      }
    } catch (error) {
      console.error("Error:", error);
      setSuccessMessage("Error occurred while adding employee data.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="form-container">
      <form
        className="form-group"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="form-row">
          <label>Employee Name:</label>
          <input
            type="text"
            name="employeeId"
            className="employee-inputs"
            placeholder="Enter Employee Full Name"
            value={formData.employeeId}
            onChange={handleInputChange}
            hidden
          />
          <input
            type="text"
            name="employeeName"
            className="employee-inputs"
            placeholder="Enter Employee Full Name"
            value={formData.employeeName}
            onChange={handleInputChange}
          />
          {errors.employeeName && (
            <div className="error">{errors.employeeName}</div>
          )}
        </div>

        <div className="form-row">
          <label>Date of Joining:</label>
          <input
            type="date"
            name="dateOfJoining"
            value={formData.dateOfJoining}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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
            <option value="Recruiters">recruiter</option>
          </select>
        </div>

        <div className="form-row">
          <label>Official Email:</label>
          <input
            type="email"
            name="officialMail"
            placeholder="Enter Official Email"
            value={formData.officialMail}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Personal Email:</label>
          <input
            type="email"
            name="employeeEmail"
            placeholder="Enter Employee Email"
            value={formData.employeeEmail}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
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

        <div className="form-row">
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
        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-row">
          <label>Marital Status:</label>
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
          >
            <option value={""}>Select Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>

        <div className="form-row">
          <label>Anniversary Date:</label>
          <input
            type="date"
            name="anniversaryDate"
            value={formData.anniversaryDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
          <label>Emergency Person Relation:</label>
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

        <div className="form-row">
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

        <div className="form-row">
          <label>Blood Group:</label>
          <input
            type="text"
            name="bloodGroup"
            placeholder="Enter Blood Group"
            value={formData.bloodGroup}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-row">
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

        <div className="form-row">
          <label>PAN Number:</label>
          <input
            type="text"
            name="panNo"
            placeholder="Enter PAN Number"
            value={formData.panNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Educational Qualification:</label>
          <input
            type="text"
            name="educationalQualification"
            placeholder="Enter Educational Qualification"
            value={formData.educationalQualification}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Offered Salary:</label>
          <input
            type="text"
            name="offeredSalary"
            placeholder="Enter Offered Salary"
            value={formData.offeredSalary}
            onChange={handleInputChange}
          />
          {errors.offeredSalary && (
            <div className="error">{errors.offeredSalary}</div>
          )}
        </div>

        <div className="form-row">
          <label>Upload Profile Image:</label>
          <input type="file" name="profileImage" onChange={handleFileChange} />
          {fileNames.profileImage && (
            <p>Selected Profile Image: {fileNames.profileImage}</p>
          )}
        </div>

        <div className="form-row">
          <label>Upload Document:</label>
          <input type="file" name="document" onChange={handleFileChange} />
          {fileNames.document && <p>Selected Document: {fileNames.document}</p>}
        </div>

        <div className="form-row">
          <label>Upload Resume:</label>
          <input type="file" name="resumeFile" onChange={handleFileChange} />
          {fileNames.resumeFile && (
            <p>Selected Resume File: {fileNames.resumeFile}</p>
          )}
        </div>

        <div className="form-row">
          <label>Employee Present Address:</label>
          <input
            type="text"
            name="employeePresentAddress"
            placeholder="Enter Present Address"
            value={formData.employeePresentAddress}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Employee Experience:</label>
          <input
            type="text"
            name="employeeExperience"
            placeholder="Enter Experience"
            value={formData.employeeExperience}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
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

        <div className="form-row">
          <label>Last Company:</label>
          <input
            type="text"
            name="lastCompany"
            placeholder="Enter Last Company"
            value={formData.lastCompany}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
          <label>Employee Status:</label>
          <select
            name="employeeStatus"
            value={formData.employeeStatus}
            onChange={handleInputChange}
          >
            <option value={""}>Select Employee Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-row">
          <label>Last Working Date:</label>
          <input
            type="date"
            name="lastWorkingDate"
            value={formData.lastWorkingDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
          <label>LinkedIn URL:</label>
          <input
            type="text"
            name="linkedInURl"
            placeholder="Enter LinkedIn URL"
            value={formData.linkedInURl}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Facebook URL:</label>
          <input
            type="text"
            name="faceBookURL"
            placeholder="Enter Facebook URL"
            value={formData.faceBookURL}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Twitter URL:</label>
          <input
            type="text"
            name="twitterURl"
            placeholder="Enter Twitter URL"
            value={formData.twitterURl}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
          <label>Employee Address:</label>
          <input
            type="text"
            name="employeeAddress"
            placeholder="Enter Employee Address"
            value={formData.employeeAddress}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-row">
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

        <div className="form-row">
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

        <div className="form-row">
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
        <div className="form-row">
          <label>Password:</label>
          <div className="password-input-container">
            <input
              type={passwordVisible ? "text" : "password"}
              name="employeePassword"
              placeholder="Enter Password"
              value={formData.employeePassword}
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="show-pass-btn"
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="form-row">
          <label>Confirm Password:</label>
          <input
            type={passwordVisible ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleConfirmPasswordBlur}
          />
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

export default UpdateEmployee;
