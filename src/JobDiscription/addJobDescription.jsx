import React, { useState, useEffect } from "react";
import "./addJobDescription.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";
import {useParams } from "react-router-dom";
import { getSocket } from "../EmployeeDashboard/socket";

const AddJobDescription = ({loginEmployeeName}) => {
  const { employeeId,userType } = useParams();
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    position: "",
    qualification: "",
    yearOfPassing: "",
    field: "",
    stream: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    bond: "",
    percentage: "",
    skills: "",
    companyLink: "",
    detailAddress: "",
    employeeName: loginEmployeeName,
    shift: "",
    weekOff: "",
    noticePeriod: "",
    jobRole: "",
    perks: "",
    incentive: "",
    reportingHierarchy: "",
    gender: "",
    documentation: "",
    ageCriteria: "",
    note: "",
    jdAddedDate: "",
    jdType: "All Members",
    jdStatus: "Active",
    holdStatus: "Unhold",
    positionOverview: { overview: "", employeeId: "" },
    responsibilities: [{ employeeId: "", responsibilitiesMsg: "" }],
    jobRequirements: [{ employeeId: "", jobRequirementMsg: "" }],
    preferredQualifications: [
      { employeeId: "", preferredQualificationMsg: "" },
    ],
  });
  // states created by sahil karnekar date 3-12-2024
  const [errors, setErrors] = useState({});
  const [errorForOverView, setErrorForOverview] = useState("");

    // establishing socket for emmiting event
    useEffect(() => {
      const newSocket = getSocket();
      setSocket(newSocket);
    }, []);

  useEffect(() => {
    const formatDate = () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = date.getHours() >= 12 ? "PM" : "AM";
      return `${day} ${month} ${year} ${hours}:${minutes} ${ampm}`;
    };

    // Update `jdAddedDate` only once on mount
    setFormData((prevFormData) => ({
      ...prevFormData,
      jdAddedDate: formatDate(),
    }));
  }, []); 
  // Empty dependency array to run only once
  // Validate specific field
  // line 75 to  167 added by sahil karnekar date 3-12-2024
  const validateField = (name, value) => {
    let error = "";
    // Check if the field is required and not empty
    if (!value.toString().trim()) {
      switch (name) {
        case "companyName":
        case "designation":
        case "location":
        case "salary":
        case "experience":
        case "skills":
          error = "*";
          break;
        default:
          break;
      }
    }

    // Check if the length exceeds 60000 characters
    if (value.length > 60000) {
      error = "Character length should be less than 60,000";
    }
    return error;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Apply validation for numeric position field
    if (name === "position" && !/^\d*$/.test(value)) {
      return; // Do not update state if the value is not numeric
    }
    // Update form data state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Validate the field and update errors state
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    console.log(value.length);
  };

  const handleInputChange = (e, field, index) => {
    const { name, value } = e.target;

    // Update form data
    const newFormData = { ...formData };
    newFormData[field][index][name] = value;

    // Validate length (max 60,000 characters)
    const errorMessage = value.length > 60000 ? "Maximum length is 60,000 characters" : "";

    // Update errors state
    setFormData(newFormData);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: {
        ...(prevErrors[field] || {}),
        [index]: {
          ...prevErrors[field]?.[index],
          [name]: errorMessage,
        },
      },
    }));
  };

  const handlePositionOverviewChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      positionOverview: {
        ...prevData.positionOverview,
        [name]: value,
      },
    }));
    if (value.length > 60000) {
      setErrorForOverview("Character length should be less than 60,000");
    } else {
      setErrorForOverview("");
    }
  };

  const handleAddMore = (field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: [
        ...prevData[field],
        { employeeId: "", [`${field.slice(0, -1)}Msg`]: "" },
      ],
    }));
  };

  const handleRemove = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // line 216 to 261 added by sahil karnekar date 3-12-2024
    if (errorForOverView !== "") {
      setLoading(false);
      console.log(errorForOverView);
      return;
    }

    // Revalidate all fields before submission
    const newErrors = {};

    // Validate top-level fields
    Object.keys(formData).forEach((key) => {
      if (!["responsibilities", "jobRequirements", "preferredQualifications"].includes(key)) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validate nested fields (responsibilities, jobRequirements, preferredQualifications)
    ["responsibilities", "jobRequirements", "preferredQualifications"].forEach((field) => {
      formData[field].forEach((item, index) => {
        const errorsForField = {};
        Object.keys(item).forEach((nestedKey) => {
          const error = validateField(nestedKey, item[nestedKey]);
          if (error) {
            errorsForField[nestedKey] = error;
          }
        });
        if (Object.keys(errorsForField).length > 0) {
          if (!newErrors[field]) {
            newErrors[field] = [];
          }
          newErrors[field][index] = errorsForField;
        }
      });
    });

    setErrors(newErrors);

    // If errors exist, prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      return;
    }
    console.log("API Object:", JSON.stringify(formData, null, 2));
    try {
      const response = await fetch(`${API_BASE_URL}/add-requirement/${employeeId}/${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {

        console.log("Emit Data Of", JSON.stringify(formData, null, 2)); 
        socket.emit("add_job_description",  formData);
        const result = await response.text();
        setLoading(true);
        toast.success(result);
        setFormData({
          companyName: "",
          designation: "",
          position: "",
          qualification: "",
          yearOfPassing: "",
          field: "",
          stream: "",
          location: "",
          salary: "",
          job_type: "",
          experience: "",
          bond: "",
          percentage: "",
          skills: "",
          companyLink: "",
          employeeName: loginEmployeeName,
          detailAddress: "",
          shift: "",
          weekOff: "",
          noticePeriod: "",
          jobRole: "",
          perks: "",
          incentive: "",
          reportingHierarchy: "",
          gender: "",
          documentation: "",
          ageCriteria: "",
          note: "",
          jdAddedDate: "",
          jdType: "All Members",
          jdStatus: "Active",
          holdStatus: "Unhold",
          positionOverview: { overview: "", employeeId: "" },
          responsibilities: [{ employeeId: "", responsibilitiesMsg: "" }],
          jobRequirements: [{ employeeId: "", jobRequirementMsg: "" }],
          preferredQualifications: [
            { employeeId: "", preferredQualificationMsg: "" },
          ],
        });
      }
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          <main className="job-desc">
            <section className="job-performance">
              {/* Align AddJobDescription name center and changing color to gray */}
              <h3 className="text-center text-[18px] text-gray-500 py-2">
                {" "}
                Add Job Description
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="job-desc-form">
                  <div className="field-column">
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Company Name:</label>
                        {/* in this multiple fields updated by sahil karnekar date 3-12-2024 */}
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: errors.companyName === "*" ? "90%" : "100%", }}
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            placeholder="Enter Company Name"
                          />
                          {errors.companyName === "*" && <span className="setStarAsError setStarPaddingJd">{errors.companyName}</span>}
                          {errors.companyName !== "*" && <p className="setStarAsError">{errors.companyName}</p>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Designation:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: errors.designation === "*" ? "90%" : "100%", }}
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="Enter Designation"
                          />
                          {errors.designation === "*" && <span className="setStarAsError setStarPaddingJd">{errors.designation}</span>}
                          {errors.designation !== "*" && <div className="setStarAsError">{errors.designation}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-white">
                      <div className="field">
                        <label>Position:</label>
                        <input
                          type="text"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          placeholder="Enter Number"
                        />
                      </div>
                      <div className="field">
                        <label>Qualification:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            placeholder="Enter Qualification"
                          />
                          {errors.qualification && <div className="setStarAsError">{errors.qualification}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Year of Passing:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="yearOfPassing"
                            value={formData.yearOfPassing}
                            onChange={handleChange}
                            placeholder="Enter Year of Passing"
                          />
                          {errors.yearOfPassing && <div className="setStarAsError">{errors.yearOfPassing}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Field:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="field"
                            value={formData.field}
                            onChange={handleChange}
                            placeholder="Enter Field"
                          />
                          {errors.field && <div className="setStarAsError">{errors.field}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-white">
                      <div className="field">
                        <label>Stream:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="stream"
                            value={formData.stream}
                            onChange={handleChange}
                            placeholder="Enter Stream"
                          />
                          {errors.stream && <div className="setStarAsError">{errors.stream}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Location:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: errors.location === "*" ? "90%" : "100%", }}
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter Location"

                          />
                          {errors.location === "*" && <span className="setStarAsError setStarPaddingJd">{errors.location}</span>}
                          {errors.location !== "*" && <div className="setStarAsError">{errors.location}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Salary:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: errors.salary === "*" ? "90%" : "100%", }}
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleChange}
                            placeholder="Enter Salary"

                          />
                          {errors.salary === "*" && <span className="setStarAsError setStarPaddingJd">{errors.salary}</span>}
                          {errors.salary !== "*" && <div className="setStarAsError">{errors.salary}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Job Type:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <select
                            style={{ width: "100%" }}

                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                          >
                            <option value="">Select Job Type</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                          {errors.jobType && <div className="setStarAsError">{errors.jobType}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-white">
                      <div className="field">
                        <label>Experience:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: errors.experience === "*" ? "90%" : "100%", }}
                            type="text"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Enter Experience"

                          />
                          {errors.experience === "*" && <span className="setStarAsError setStarPaddingJd">{errors.experience}</span>}
                          {errors.experience !== "*" && <div className="setStarAsError">{errors.experience}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Bond:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="bond"
                            value={formData.bond}
                            onChange={handleChange}
                            placeholder="Ex. 2 Years or 3 Years"
                          />
                          {errors.bond && <div className="setStarAsError">{errors.bond}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Percentage:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="percentage"
                            value={formData.percentage}
                            onChange={handleChange}
                            placeholder="Enter Percentage"
                          />
                          {errors.percentage && <div className="setStarAsError">{errors.percentage}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Skills:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{
                              width: errors.skills === "*" ? "90%" : "100%",
                            }}
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="Enter Skills"
                          />
                          {errors.skills === "*" && (
                            <span className="setStarAsError setStarPaddingJd">
                              {errors.skills}
                            </span>
                          )}
                          {errors.skills !== "*" && <div className="setStarAsError">{errors.skills}</div>}
                        </div>

                      </div>
                    </div>
                    <div className="field-Row-white">
                      <div className="field">
                        <label>Company Link:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="companyLink"
                            value={formData.companyLink}
                            onChange={handleChange}
                            placeholder="Enter Company Link"
                          />
                          {errors.companyLink && <div className="setStarAsError">{errors.companyLink}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Detailed Address:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="detailAddress"
                            value={formData.detailAddress}
                            onChange={handleChange}
                            placeholder="Enter Detailed Address"
                          />
                          {errors.detailAddress && <div className="setStarAsError">{errors.detailAddress}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Shift:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="shift"
                            value={formData.shift}
                            onChange={handleChange}
                            placeholder="Enter Shift"
                          />
                          {errors.shift && <div className="setStarAsError">{errors.shift}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Week Off:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="weekOff"
                            value={formData.weekOff}
                            onChange={handleChange}
                            placeholder="Enter Week Off"
                          />
                          {errors.weekOff && <div className="setStarAsError">{errors.weekOff}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-white">
                      <div className="field">
                        <label>Notice Period:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="noticePeriod"
                            value={formData.noticePeriod}
                            onChange={handleChange}
                            placeholder="Enter Notice Period"
                          />
                          {errors.noticePeriod && <div className="setStarAsError">{errors.noticePeriod}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Job Role:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="jobRole"
                            value={formData.jobRole}
                            onChange={handleChange}
                            placeholder="Enter Job Role"
                          />
                          {errors.jobRole && <div className="setStarAsError">{errors.jobRole}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Perks:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="perks"
                            value={formData.perks}
                            onChange={handleChange}
                            placeholder="Enter Perks"
                          />
                          {errors.perks && <div className="setStarAsError">{errors.perks}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Incentive:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="incentive"
                            value={formData.incentive}
                            onChange={handleChange}
                            placeholder="Enter Incentive"
                          />
                          {errors.incentive && <div className="setStarAsError">{errors.incentive}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="field-Row-white">
                      <div className="field">
                        <label>Reporting Hierarchy:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="reportingHierarchy"
                            value={formData.reportingHierarchy}
                            onChange={handleChange}
                            placeholder="Enter Reporting Hierarchy"
                          />
                          {errors.reportingHierarchy && <div className="setStarAsError">{errors.reportingHierarchy}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Gender:</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Any">Any</option>
                        </select>
                      </div>
                    </div>

                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Documentation:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="documentation"
                            value={formData.documentation}
                            onChange={handleChange}
                            placeholder="Enter Documentation"
                          />
                          {errors.documentation && <div className="setStarAsError">{errors.documentation}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Age Criteria:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="ageCriteria"
                            value={formData.ageCriteria}
                            onChange={handleChange}
                            placeholder="Enter Age Criteria"
                          />
                          {errors.ageCriteria && <div className="setStarAsError">{errors.ageCriteria}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Arshad Attar Added New Code From Here , JD New fields 27-10-2024 */}
                    <div className="field-Row-Gray">
                      <div className="field">
                        <label>Select JD Type :</label>
                        <select
                          name="jdType"
                          value={formData.jdType}
                          onChange={handleChange}
                        >
                          <option value="">Select JD Type</option>
                          <option value="All Members">All Members</option>
                          <option value="Team Members">Team Members</option>
                        </select>
                      </div>

                      <div className="field">
                        <label>Select JD Status</label>
                        <select
                          name="jdStatus"
                          value={formData.jdStatus}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>


                        </select>
                      </div>
                    </div>
                    {/* Arshad Attar Added New Code From Here , JD New fields 27-10-2024  */}

                    <div className="field-Row-white">
                      <div className="field">
                        <label>Note:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <input
                            style={{ width: "100%" }}
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Enter Note"
                          />
                          {errors.note && <div className="setStarAsError">{errors.note}</div>}
                        </div>
                      </div>
                      <div className="field">
                        <label>Position Overview:</label>
                        <div className="setDivDisplayBlockForJDValidation">
                          <textarea
                            name="overview"
                            className="textarea"
                            value={formData.positionOverview.overview}
                            onChange={(e) => {
                              handlePositionOverviewChange(e);
                              e.target.style.height = "auto";
                              e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            placeholder="Describe Position Overview"
                            style={{
                              resize: "none",
                              overflow: "hidden",
                              width: "100%",
                            }}
                          />
                          {errorForOverView && <div className="setStarAsError">{errorForOverView}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white multi-field">
                      {formData.responsibilities.map((item, index) => (
                        <div key={index}>
                          <div className="field" hidden>
                            <label>Employee ID:</label>
                            <input
                              type="text"
                              name="employeeId"
                              className=""
                              value={item.employeeId}
                              onChange={(e) =>
                                handleInputChange(e, "responsibilities", index)
                              }
                            />
                          </div>
                          <div className="field">
                            <label>Responsibility Message:</label>

                            <div className="setDivWidth100ForResponsiveness">
                              <textarea
                                className="textarea"
                                name="responsibilitiesMsg"
                                value={item.responsibilitiesMsg}
                                onChange={(e) => {
                                  handleInputChange(e, "responsibilities", index);
                                  e.target.style.height = "auto"; // Reset the height
                                  e.target.style.height = `${e.target.scrollHeight}px`; // Adjust the height based on content
                                }}
                                placeholder="Enter Responsibility Message"
                                style={{
                                  resize: "none", // Prevent manual resizing
                                  overflow: "hidden", // Hide scrollbars
                                }}
                              />
                              {errors.responsibilities?.[index]?.responsibilitiesMsg && (
                                <p className="error-message">
                                  {errors.responsibilities[index].responsibilitiesMsg}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="job-remove-button"
                              onClick={() =>
                                handleRemove("responsibilities", index)
                              }
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="ajd-btndiv-div">
                        <button
                          type="button"
                          className="lineUp-Filter-btn"
                          onClick={() => handleAddMore("responsibilities")}
                        >
                          Add More Responsibilities
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-100 multi-field">
                      {formData.jobRequirements.map((item, index) => (
                        <div key={index}>
                          <div className="field" hidden>
                            <label>Employee ID:</label>
                            <input
                              type="text"
                              name="employeeId"
                              value={item.employeeId}
                              onChange={(e) =>
                                handleInputChange(e, "jobRequirements", index)
                              }
                            />
                          </div>
                          <div className="field">
                            <label>Job Requirement Message:</label>
                            <div className="setDivWidth100ForResponsiveness">
                              <textarea
                                className="textarea"
                                name="jobRequirementMsg"
                                value={item.jobRequirementMsg}
                                onChange={(e) => {
                                  handleInputChange(e, "jobRequirements", index);
                                  e.target.style.height = "auto";
                                  e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                placeholder="Enter Job Requirement Message"
                                style={{
                                  resize: "none", // Prevent manual resizing
                                  overflow: "hidden", // Hide scrollbars
                                }}
                              />
                              {errors.jobRequirements?.[index]?.jobRequirementMsg && (
                                <p className="error-message">
                                  {errors.jobRequirements[index].jobRequirementMsg}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="job-remove-button"
                              onClick={() =>
                                handleRemove("jobRequirements", index)
                              }
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="ajd-btndiv-div">
                        <button
                          type="button"
                          className="lineUp-Filter-btn"
                          onClick={() => handleAddMore("jobRequirements")}
                        >
                          Add More Job Requirements
                        </button>
                      </div>
                    </div>

                    <div className="multi-field">
                      {/* <h3>Preferred Qualifications</h3> */}
                      {formData.preferredQualifications.map((item, index) => (
                        <div key={index}>
                          <div className="field" hidden>
                            <label>Employee ID:</label>
                            <input
                              type="text"
                              name="employeeId"
                              value={item.employeeId}
                              onChange={(e) =>
                                handleInputChange(
                                  e,
                                  "preferredQualifications",
                                  index
                                )
                              }
                            />
                          </div>
                          <div className="field">
                            <label>Preferred Qualification Message:</label>
                            <div className="setDivWidth100ForResponsiveness">
                              <textarea
                                className="textarea"
                                name="preferredQualificationMsg"
                                value={item.preferredQualificationMsg}
                                onChange={(e) => {
                                  handleInputChange(
                                    e,
                                    "preferredQualifications",
                                    index
                                  );
                                  e.target.style.height = "auto";
                                  e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                placeholder="Enter Preferred Qualification Message"
                                style={{
                                  resize: "none", // Prevent manual resizing
                                  overflow: "hidden", // Hide scrollbars
                                }}
                              />
                              {errors.preferredQualifications?.[index]?.preferredQualificationMsg && (
                                <p className="error-message">
                                  {errors.preferredQualifications[index].preferredQualificationMsg}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              className="job-remove-button"
                              onClick={() =>
                                handleRemove("preferredQualifications", index)
                              }
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="ajd-btndiv-div">
                        <button
                          type="button"
                          className="lineUp-Filter-btn"
                          onClick={() =>
                            handleAddMore("preferredQualifications")
                          }
                        >
                          Add More Preferred Qualifications
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="job-submit-button">
                  <button className="daily-tr-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default AddJobDescription;
