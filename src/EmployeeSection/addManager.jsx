import React, { useEffect, useState } from "react";
import "../EmployeeSection/addEmployee.css";
import { toast } from "react-toastify"
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "./getFormattedDateTime";
import Loader from "./loader";
import { fetchCompleteProfileData } from "../HandlerFunctions/fetchCompleteProfileData";

const AddManager = ({ loginEmployeeName, updateEmployeeIdForForm }) => {
    const { employeeId, userType } = useParams();
    const [socket, setSocket] = useState(null);
    const [formData, setFormData] = useState({
        // managerId: "0",
        managerName: "",
        dateOfJoiningM: "",
        userName: "",
        designationM: "",
        departmentM: "",
        officialMailM: "",
        personalMaliM: "",
        officialNumberM: "",
        personalNumberM: "",
        dateOfBirthM: "",
        genderM: "",
        companyMobileNoM: "",
        whatsAppNoM: "",
        emergencyContactPersonM: "",
        emergencyContactNoM: "",
        emergencyPersonRelationM: "",
        presentAddressM: "",
        experienceM: "",
        perksM: "",
        maritalStatusM: "",
        anniversaryDateM: "",
        tshirtSizeM: "",
        lastCompanyM: "",
        workLocationM: "",
        entrySourceM: "",
        managerStatus: "",
        lastWorkingDate: "",
        reasonForLeaving: "",
        inductionYesOrNo: "",
        inductionComment: "",
        trainingSource: "",
        trainingCompleted: "",
        trainingTakenCount: "",
        roundsOfInterview: "",
        interviewTakenPerson: "",
        warningComments: "",
        performanceIndicator: "",
        messageForAdmin: "",
        editDeleteAuthority: "",
        linkedInURL: "",
        faceBookURL: "",
        twitterURL: "",
        managerAddress: "",
        bloodGroup: "",
        managerAadhaarNo: "",
        managerPanNo: "",
        managerQualification: "",
        managerSalary: "",
        jobRole: "",
        professionalPtNo: "",
        esIcNo: "",
        pfNo: "",
        managerInsuranceNumber: "",
        reportingAdminName: "",
        reportingAdminDesignation: "",
        managerPassword: "",
        managerConfirmPassword: "",
        profileImage: null,
        document: null,
        resumeFile: null,
        maritalStatus: "",         // single/married/etc.
        managerPassword: "",
        managerConfirmPassword: ""
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [confirmpasswordVisible, setmanagerConfirmPasswordVisible] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            if (updateEmployeeIdForForm) {
                setLoading(true);
                try {
                    const resp = await fetchCompleteProfileData(updateEmployeeIdForForm, "Manager");
                    setFormData((prevFormData) => ({
                        ...resp,
                        managerAadhaarNo: resp.aadhaarNo,
                        managerAddress: resp.address,
                        personalNumberM: resp.alternateContactNo,
                        anniversaryDateM: resp.anniversaryDate,
                        companyMobileNoM: resp.companyMobileNo,
                        managerConfirmPassword: resp.confirmPassword,
                        dateOfBirthM: resp.dateOfBirth,
                        dateOfJoiningM: resp.dateOfJoining,
                        departmentM: resp.department,
                        designationM: resp.designation,
                        editDeleteAuthority: resp.editDeleteAuthority,
                        emergencyContactNoM: resp.emergencyContactNo,
                        emergencyContactPersonM: resp.emergencyContactPerson,
                        emergencyPersonRelationM: resp.emergencyPersonRelation,
                        entrySourceM: resp.entrySource,
                        esIcNo: resp.esIcNo,
                        experienceM: resp.experience,
                        faceBookURL: resp.faceBookURL,
                        genderM: resp.gender,
                        inductionComment: resp.inductionComment,
                        inductionYesOrNo: resp.inductionYesOrNo,
                        managerInsuranceNumber: resp.insuranceNumber,
                        interviewTakenPerson: resp.interviewTakenPerson,
                        jobRole: resp.jobRole,
                        lastCompanyM: resp.lastCompany,
                        linkedInURL: resp.linkedInURL,
                        maritalStatusM: resp.maritalStatus,
                        messageForAdmin: resp.messageForAdmin,
                        managerName: resp.name,
                        officialNumberM: resp.officialContactNo,
                        officialMailM: resp.officialMail,
                        managerPanNo: resp.panNo,
                        managerPassword: resp.password,
                        performanceIndicator: resp.performanceIndicator,
                        perksM: resp.perks,
                        personalMaliM: resp.personalEmailId,
                        pfNo: resp.pfNo,
                        presentAddressM: resp.presentAddress,
                        professionalPtNo: resp.professionalPtNo,
                        managerQualification: resp.qualification,
                        reasonForLeaving: resp.reasonForLeaving,
                        reportingAdminDesignation: resp.reportingPersonDesignation,
                        reportingAdminName: resp.reportingPersonName,
                        roundsOfInterview: resp.roundsOfInterview,
                        managerStatus: resp.status,
                        trainingCompleted: resp.trainingCompletedYesOrNo,
                        trainingSource: resp.trainingSource,
                        trainingTakenCount: resp.trainingTakenCount,
                        tshirtSizeM: resp.tshirtSize,
                        twitterURL: resp.twitterURL,
                        warningComments: resp.warningComments,
                        whatsAppNoM: resp.whatsAppNo,
                        workLocationM: resp.workLocation,
                        lastWorkingDate: resp.workingDate,
                        managerSalary: resp.salary
                    }));
                    console.log("Response from API:", resp);
                } catch (error) {
                    console.error("Error fetching employee data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [updateEmployeeIdForForm, employeeId, userType]);
    //----------------------SAKSHI KASHID 09/07/2025---------------
    const validateManagerField = (name, value, file = null, formData) => {
        switch (name) {
            case "managerName":
                const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
                if (value.trim() !== value) return "No space at start or end.";
                if (!nameRegex.test(value)) return "Only alphabets, one space between words, no special characters.";
                if (value.length > 30) return "Max 30 characters allowed.";
                break;

            case "officialMailM":
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
                if (!emailRegex.test(value)) return "Invalid email format.";
                break;

            case "userName":
                const userRegex = /^(?![.])[a-zA-Z0-9._]+(?<![.])$/;
                if (value.trim() !== value) return "No space at start or end.";
                if (!userRegex.test(value)) return "Only letters, numbers and symbols( . and _ ) allowed, . not allowed at start and end.";
                if (value.length > 15) return "Max 15 characters allowed.";
                break;

            case "officialNumberM":
                if (!/^\d{10}$/.test(value)) return "Must be exactly 10 digits.";
                break;

            case "managerAadhaarNo":
                if (!/^\d{12}$/.test(value)) return "Must be exactly 12 digits.";
                break;

            case "managerPanNo":
                if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) return "Format must be ABCDE1234F.";
                break;

            case "presentAddressM":
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

            case "managerPassword":
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
                if (!passwordRegex.test(value)) return "Min 8 chars, 1 capital, 1 number, 1 special char.";
                break;

            case "managerConfirmPassword":
                if (value !== formData.managerPassword) return "Passwords do not match.";
                break;

            case "designationM":
                if (value.length > 30) return "Max 30 characters allowed.";
                break;

            case "personalNumberM":
            case "companyMobileNoM":
            case "whatsAppNoM":
            case "emergencyContactNoM":
                if (value && !/^\d{10}$/.test(value)) return "Must be exactly 10 digits.";
                break;

            case "managerInsuranceNumber":
            case "professionalPtNo":
            case "esIcNo":
            case "pfNo":
                if (value && !/^\d{6,20}$/.test(value)) return "Only digits allowed (6 to 20 digits).";
                break;

            case "trainingTakenCount":
            case "roundsOfInterview":
                if (value && !/^\d+$/.test(value)) return "Must be a valid number.";
                break;

            case "managerQualification":
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



    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            if (!file) return;
            //---------SAKSHI KASHID 09/07/2025--------
            // File size limits (in bytes)
            const maxSizes = {
                profileImage: 2 * 1024 * 1024,     // 2 MB
                resumeFile: 5 * 1024 * 1024,       // 5 MB
                document: 5 * 1024 * 1024    // 5 MB
            };

            // Check size limit if applicable
            if (maxSizes[name] && file.size > maxSizes[name]) {
                const readableSize = maxSizes[name] / (1024 * 1024);
                toast.error(`${name} should not exceed ${readableSize} MB.`);
                setErrors((prev) => ({
                    ...prev,
                    [name]: `File size must be ≤ ${readableSize} MB.`,
                }));
                return;
            }
            const error = validateManagerField(name, "", file, formData);
            if (error) {
                setErrors((prev) => ({ ...prev, [name]: error }));
            } else {
                setErrors((prev) => ({ ...prev, [name]: "" }));
                setFormData((prev) => ({ ...prev, [name]: file }));
            }
            return;
        }

        const error = validateManagerField(name, value, null, formData);
        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }

        // Optional: For text-only fields (prevent numbers)
        const textOnlyFields = [
            "managerName", "designationM", "departmentM", "perksM", "lastCompanyM", "workLocationM", "entrySourceM",
            "reasonForLeaving", "inductionComment", "trainingSource", "emergencyContactPersonM",
            "emergencyPersonRelationM", "interviewTakenPerson", "warningComments", "performanceIndicator",
            "messageForAdmin", "editDeleteAuthority", "bloodGroup", "managerQualification", "reportingAdminName",
            "reportingAdminDesignation"
        ];

        if (textOnlyFields.includes(name)) {
            if (/\d/.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "Please enter character value only.",
                }));
            }
        }

        // Optional: For numeric-only fields
        const numericOnlyFields = [
            "officialNumberM", "personalNumberM", "companyMobileNoM", "whatsAppNoM", "emergencyContactNoM",
            "managerInsuranceNumber", "managerAadhaarNo", "managerSalary", "trainingTakenCount",
            "professionalPtNo", "esIcNo", "pfNo", "roundsOfInterview"
        ];

        if (numericOnlyFields.includes(name)) {
            if (/[^0-9]/.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "Please enter numeric value only.",
                }));
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleConfirmPasswordBlur = () => {
        if (formData.managerPassword !== formData.managerConfirmPassword) {
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

        if (!passwordMatch) {
            setPasswordError("Passwords do not match");
            return;
        }

        const requiredFields = {
            managerName: "Manager Name",
            dateOfJoiningM: "Date of Joining",
            jobRole: "Job Role",
            officialMailM: "Official Email",
            userName: "User Name",
            officialNumberM: "Official Contact No.",
            managerAadhaarNo: "Aadhaar Number",
            managerPanNo: "PAN Number",
            presentAddressM: "Present Address",
            profileImage: "Profile Image",
            resumeFile: "Resume",
            managerPassword: "Password",
            managerConfirmPassword: "Confirm Password",
            designationM: "Designation"
        };

        let hasError = false;
        const newErrors = {};

        for (const [field, label] of Object.entries(requiredFields)) {
            const value = formData[field];
            if (
                value === "" ||
                value === null ||
                value === undefined ||
                (field.includes("Date") && !/^\d{4}-\d{2}-\d{2}$/.test(value))
            ) {
                newErrors[field] = `${label} is required.`;
                hasError = true;
            }
        }

        if (hasError) {
            setErrors(newErrors);
            toast.error("Please fill all required fields.");
            return;
        }


        const numberFields = [
            "officialNumberM",
            "personalNumberM",
            "companyMobileNoM",
            "whatsAppNoM",
            "emergencyContactNoM",
            "managerAadhaarNo",
            "managerSalary",
            "professionalPtNo",
            "esIcNo",
            "pfNo",
            "trainingTakenCount",
            "managerInsuranceNumber"
        ];


        const formDataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value === undefined || value === "undefined") return;

            // ✅ Skip number fields with empty or invalid values
            if (numberFields.includes(key)) {
                // const trimmed = String(value).trim();
                // // if (value === "" || value === null || isNaN(trimmed)) {
                // //   return; // 🔥 Omit from formDataToSend
                // // }

                const num = Number(value);
                if (!Number.isFinite(num)) {
                    return; // Skip invalid number
                }
                formDataToSend.append(key, num);
                return;
            }

            // ✅ Append File objects directly
            if (value instanceof File) {
                formDataToSend.append(key, value);
                return;
            }

            // ✅ All other values — stringified and trimmed
            formDataToSend.append(key, value?.toString().trim() ?? "");

            for (const [key, val] of formDataToSend.entries()) {
                if (val === "") {
                    console.warn(`❗ Field '${key}' is being sent as empty string`);
                }
            }

        });


        try {

            const response = await fetch(

                `${API_BASE_URL}/save-managers/${employeeId}/${userType}`,
                {
                    method: "POST",
                    body: formDataToSend,
                }
            );

            const responseBody = await response.json();
            console.log('Response Body:', responseBody);
            let newId = responseBody.id;
            if (response.ok) {
                console.log(formData);
                
                toast.success( "Manager Data Added Successfully.");


                const emitData = {
                    managerName: formData.managerName,
                    dateOfJoiningM: getFormattedDateTime(),
                    userName: formData.userName,
                    jobRole: formData.jobRole,
                    reportingAdminName: loginEmployeeName,
                    employeeId: newId,
                    userType: "Manager",
                }

                console.log(emitData);


                socket.emit("add_manager_event", emitData);
                setFormData({
                    // managerId: "0",
                    managerName: "",
                    dateOfJoiningM: "",
                    userName: "",
                    designationM: "",
                    departmentM: "",
                    officialMailM: "",
                    personalMaliM: "",
                    officialNumberM: "",
                    personalNumberM: "",
                    dateOfBirthM: "",
                    genderM: "",
                    companyMobileNoM: "",
                    whatsAppNoM: "",
                    emergencyContactPersonM: "",
                    emergencyContactNoM: "",
                    emergencyPersonRelationM: "",
                    presentAddressM: "",
                    experienceM: "",
                    perksM: "",
                    maritalStatusM: "",
                    anniversaryDateM: "",
                    tshirtSizeM: "",
                    lastCompanyM: "",
                    workLocationM: "",
                    entrySourceM: "",
                    managerStatus: "",
                    lastWorkingDate: "",
                    reasonForLeaving: "",
                    inductionYesOrNo: "",
                    inductionComment: "",
                    trainingSource: "",
                    trainingCompleted: "",
                    trainingTakenCount: "",
                    roundsOfInterview: "",
                    interviewTakenPerson: "",
                    warningComments: "",
                    performanceIndicator: "",
                    messageForAdmin: "",
                    editDeleteAuthority: "",
                    linkedInURL: "",
                    faceBookURL: "",
                    twitterURL: "",
                    managerAddress: "",
                    bloodGroup: "",
                    managerAadhaarNo: "",
                    managerPanNo: "",
                    managerQualification: "",
                    managerSalary: "",
                    jobRole: "",
                    professionalPtNo: "",
                    esIcNo: "",
                    pfNo: "",
                    managerInsuranceNumber: "",
                    reportingAdminName: "",
                    reportingAdminDesignation: "",
                    managerPassword: "",
                    managerConfirmPassword: "",
                    profileImage: null,
                    document: null,
                    resumeFile: null,

                })
            } else {
                Object.entries(formData).forEach(([key, value]) => {
                    console.log(`${key}: ${value} (type: ${typeof value})`);
                });
                // console.log("Response body:",responseBody)
                toast.error(responseBody.message && "Something went wrong. Please try again.");
            }

        } catch (error) {
            console.error("Error:", error);
            toast.error("Error occurred while adding employee data.");
        }
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible((prev) => !prev);
    };
    const togglemanagerConfirmPasswordVisibility = () => {
        setmanagerConfirmPasswordVisible((prev) => !prev);
    };

    const showPassword = () => setPasswordVisible(true);
    const hidePassword = () => setPasswordVisible(false);
    const showmanagerConfirmPassword = () => setmanagerConfirmPasswordVisible(true);
    const hidemanagerConfirmPassword = () => setmanagerConfirmPasswordVisible(false)

    return (
        <div className="AddRec-form-container">
            <form
                className="AddRec-form-group"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <input type="text" name="managerId" value={formData.managerId} hidden readOnly id="" />
                <div className="addRec-form-row">
                    <label>Manager Name: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="text"
                        name="managerName"
                        className="employee-inputs"
                        placeholder="Enter Employee Full Name"
                        value={formData.managerName}
                        onChange={handleInputChange}
                    />
                    {errors.managerName && (
                        <div className="error">{errors.managerName}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Date of Joining: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="date"
                        name="dateOfJoiningM"
                        value={formData.dateOfJoiningM}
                        onChange={handleInputChange}
                    />
                    {errors.dateOfJoiningM && (
                        <div className="error">{errors.dateOfJoiningM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Designation: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="text"
                        name="designationM"
                        placeholder="Eg: FrontEnd Developer"
                        value={formData.designationM}
                        onChange={handleInputChange}
                    />
                    {errors.designationM && (
                        <div className="error">{errors.designationM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Department:</label>
                    <input
                        type="text"
                        name="departmentM"
                        placeholder="Enter Department"
                        value={formData.departmentM}
                        onChange={handleInputChange}
                    />
                    {errors.departmentM && (
                        <div className="error">{errors.departmentM}</div>
                    )}
                </div>


                <div className="addRec-form-row">
                    <label>Job Role: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <select
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleInputChange}
                        className="readonly-input"
                    >
                        <option value="" >Select</option>
                        <option value="Manager">Manager</option>
                    </select>
                    {errors.jobRole && (
                        <div className="error">{errors.jobRole}</div>
                    )}
                </div>


                <div className="addRec-form-row">
                    <label>Official Email: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="email"
                        name="officialMailM"
                        placeholder="Enter Official Email"
                        value={formData.officialMailM}
                        onChange={handleInputChange}
                    />
                    {errors.officialMailM && (
                        <div className="error">{errors.officialMailM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Personal Email:</label>
                    <input
                        type="email"
                        name="personalMaliM"
                        placeholder="Enter Employee Email"
                        value={formData.personalMaliM}
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
                    <label>Personal Mobile Number:</label>
                    <input
                        type="text"
                        accept="0-9"
                        name="personalNumberM"
                        placeholder="Enter Alternate Mobile Number"
                        value={formData.personalNumberM}
                        onChange={handleInputChange}
                    />
                    {errors.personalNumberM && (
                        <div className="error">{errors.personalNumberM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Official Contact Number: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="text"
                        accept="0-9"
                        name="officialNumberM"
                        placeholder="Enter Company Mobile Number"
                        value={formData.officialNumberM}
                        onChange={handleInputChange}
                    />
                    {errors.officialNumberM && (
                        <div className="error">{errors.officialNumberM}</div>
                    )}
                </div>
                <div className="addRec-form-row">
                    <label>Company Mobile Number:</label>
                    <input
                        type="text"
                        accept="0-9"
                        name="companyMobileNoM"
                        placeholder="Enter Company Mobile Number"
                        value={formData.companyMobileNoM}
                        onChange={handleInputChange}
                    />
                    {errors.companyMobileNoM && (
                        <div className="error">{errors.companyMobileNoM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>WhatsApp Number:</label>
                    <input
                        type="text"
                        accept="0-9"
                        name="whatsAppNoM"
                        placeholder="Enter WhatsApp Number"
                        value={formData.whatsAppNoM}
                        onChange={handleInputChange}
                    />
                    {errors.whatsAppNoM && (
                        <div className="error">{errors.whatsAppNoM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="dateOfBirthM"
                        value={formData.dateOfBirthM}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="addRec-form-row">
                    <label>Gender:</label>
                    <select
                        name="genderM"
                        value={formData.genderM}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Femal">Female</option>

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
                                style={{ width: "456%" }}
                                type="date"
                                name="anniversaryDate"
                                value={formData.anniversaryDateM}
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
                        name="emergencyContactPersonM"
                        placeholder="Enter Emergency Contact Person Name"
                        value={formData.emergencyContactPersonM}
                        onChange={handleInputChange}
                    />
                    {errors.emergencyContactPersonM && (
                        <div className="error">{errors.emergencyContactPersonM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Emergency Contact Number:</label>
                    <input
                        type="text"
                        name="emergencyContactNoM"
                        placeholder="Enter Emergency Contact Number"
                        value={formData.emergencyContactNoM}
                        onChange={handleInputChange}
                    />
                    {errors.emergencyContactNoM && (
                        <div className="error">{errors.emergencyContactNoM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label> Relation With Person:</label>
                    <input
                        type="text"
                        name="emergencyPersonRelationM"
                        placeholder="Enter Emergency Person Relation"
                        value={formData.emergencyPersonRelationM}
                        onChange={handleInputChange}
                    />
                    {errors.emergencyPersonRelationM && (
                        <div className="error">{errors.emergencyPersonRelationM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>T-shirt Size:</label>
                    <select
                        name="tshirtSizeM"
                        value={formData.tshirtSizeM}
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
                        name="managerAadhaarNo"
                        placeholder="Enter Aadhaar Number"
                        value={formData.managerAadhaarNo}
                        onChange={handleInputChange}
                    />
                    {errors.managerAadhaarNo && <div className="error">{errors.managerAadhaarNo}</div>}
                </div>

                <div className="addRec-form-row">
                    <label>PAN Card Number: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="text"
                        name="managerPanNo"
                        placeholder="Enter PAN Card Number"
                        value={formData.managerPanNo}
                        onChange={handleInputChange}
                    />
                    {errors.managerPanNo && <div className="error">{errors.managerPanNo}</div>}

                </div>

                <div className="addRec-form-row">
                    <label>Educational Qualification:</label>
                    <input
                        type="text"
                        name="managerQualification"
                        placeholder="Enter Educational Qualification"
                        value={formData.managerQualification}
                        onChange={handleInputChange}
                    />
                    {errors.managerQualification && <div className="error">{errors.managerQualification}</div>}

                </div>

                <div className="addRec-form-row">
                    <label>Gross Salary (lpa):</label>
                    <input
                        type="text"
                        name="managerSalary"
                        placeholder="Enter Gross Salary"
                        value={formData.managerSalary}
                        onChange={handleInputChange}
                    />
                    {errors.managerSalary && (
                        <div className="error">{errors.managerSalary}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Employee Present Address: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <input
                        type="text"
                        name="presentAddressM"
                        placeholder="Enter Present Address"
                        value={formData.presentAddressM}
                        onChange={handleInputChange}
                    />
                    {errors.presentAddressM && (
                        <div className="error">{errors.presentAddressM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Employee Experience:</label>
                    <input
                        type="text"
                        name="experienceM"
                        placeholder="Enter Experience"
                        value={formData.experienceM}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="addRec-form-row">
                    <label>Perks:</label>
                    <input
                        type="text"
                        name="perksM"
                        placeholder="Enter Perks"
                        value={formData.perksM}
                        onChange={handleInputChange}
                    />
                    {errors.perksM && <div className="error">{errors.perksM}</div>}
                </div>

                <div className="addRec-form-row">
                    <label>Last Company:</label>
                    <input
                        type="text"
                        name="lastCompanyM"
                        placeholder="Enter Last Company"
                        value={formData.lastCompanyM}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="addRec-form-row">
                    <label>Work Location:</label>
                    <input
                        type="text"
                        name="workLocationM"
                        placeholder="Enter Work Location"
                        value={formData.workLocationM}
                        onChange={handleInputChange}
                    />
                    {errors.workLocationM && (
                        <div className="error">{errors.workLocationM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Entry Source:</label>
                    <input
                        type="text"
                        name="entrySourceM"
                        placeholder="Enter Entry Source"
                        value={formData.entrySourceM}
                        onChange={handleInputChange}
                    />
                    {errors.entrySourceM && (
                        <div className="error">{errors.entrySourceM}</div>
                    )}
                </div>

                <div className="addRec-form-row">
                    <label>Employee Status:</label>
                    <select
                        name="managerStatus"
                        value={formData.managerStatus}
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
                        name="trainingCompleted"
                        value={formData.trainingCompleted}
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
                        name="managerAddress"
                        placeholder="Enter Employee Address"
                        value={formData.managerAddress}
                        onChange={handleInputChange}
                    />
                    {errors.managerAddress && (
                        <div className="error">{errors.managerAddress}</div>
                    )}
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
                        name="managerInsuranceNumber"
                        placeholder="Enter Insurance Number"
                        value={formData.managerInsuranceNumber}
                        onChange={handleInputChange}
                    />
                    {errors.managerInsuranceNumber && (
                        <div className="error">{errors.managerInsuranceNumber}</div>
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
                    <label>Upload Resume (max size 5 mb): <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <div className="wraptickindiv">
                        <input type="file"
                            multiple
                            name="resumeFile"
                            accept=".pdf,.docx"
                            onChange={handleInputChange} />
                        {errors.resumeFile && (
                            <div className="error">{errors.resumeFile}</div>
                        )}

                        {
                            formData.resumeFile && (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#78A75A"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" /></svg>
                            )
                        }
                    </div>
                </div>
                <div className="addRec-form-row">
                    <label>Upload Profile Image (max size 2 mb): <span style={{ color: "red" }}>&nbsp;*</span></label>

                    <div className="wraptickindiv">
                        <input
                            type="file"
                            name="profileImage"
                            accept=".png,.jpg,.jpeg,.gif"

                            onChange={handleInputChange}
                        />
                        {errors.profileImage && (
                            <div className="error">{errors.profileImage}</div>
                        )}
                        {
                            formData.profileImage && (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#78A75A"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" /></svg>
                            )
                        }
                    </div>
                </div>

                <div className="addRec-form-row">
                    <label>Upload Document (max size 5 mb):</label>
                    <div className="wraptickindiv">
                        <input type="file"
                            multiple
                            name="document"
                            accept=".pdf,.docx"

                            onChange={handleInputChange} />
                        {errors.document && (
                            <div className="error">{errors.document}</div>
                        )}
                        {
                            formData.document && (
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#78A75A"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q65 0 123 19t107 53l-58 59q-38-24-81-37.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-18-2-36t-6-35l65-65q11 32 17 66t6 70q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-56-216L254-466l56-56 114 114 400-401 56 56-456 457Z" /></svg>
                            )
                        }
                    </div>
                </div>

                <div className="addRec-form-row">
                    <label>Password: <span style={{ color: "red" }}>&nbsp;*</span></label>

                    <div className="wrapper-eye">
                        <div className="password-eye-icon"
                            onMouseEnter={showPassword}
                            onMouseLeave={hidePassword}>
                            <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </div>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="managerPassword"
                            placeholder="Enter Password"
                            value={formData.managerPassword}
                            onChange={handleInputChange}
                        />
                        {errors.managerPassword && (
                            <div className="error">{errors.managerPassword}</div>
                        )}
                    </div>
                </div>

                <div className="addRec-form-row">
                    <label>Confirm Password: <span style={{ color: "red" }}>&nbsp;*</span></label>
                    <div className="wrapper-eye">
                        <div className="password-eye-icon"
                            onMouseEnter={showPassword}
                            onMouseLeave={hidePassword}>
                            <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </div>
                        <input
                            type={passwordVisible ? "text" : "password"}
                            name="managerConfirmPassword"
                            placeholder="Confirm Password"
                            value={formData.managerConfirmPassword}
                            onChange={handleInputChange}
                            onBlur={handleConfirmPasswordBlur}
                        />
                        {errors.managerConfirmPassword && (
                            <div className="error">{errors.managerConfirmPassword}</div>
                        )}
                    </div>

                    {/* {!passwordMatch && <div className="error">{passwordError}</div>} */}
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

            {
                loading && (
                    <Loader />
                )
            }
        </div>
    );
};


export default AddManager;
