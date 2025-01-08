import React, { useState, useEffect } from "react";
import "./addJobDescription.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../api/api";
import {useParams } from "react-router-dom";
import { getSocket } from "../EmployeeDashboard/socket";
import { getFormattedDateTime } from "../EmployeeSection/getFormattedDay";

// sahil karnekar line 9_  date : 10-10-2024
const UpdateJobDescription = ({ onAddJD, toggleUpdateCompProp,loginEmployeeName}) => {
  const { employeeId, userType } = useParams();
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    employee:loginEmployeeName,
    companyName: onAddJD.companyName || "",
    designation: onAddJD.designation || "",
    position: onAddJD.position || "",
    qualification: onAddJD.qualification || "",
    yearOfPassing: onAddJD.yearOfPassing || "",
    field: onAddJD.field || "",
    stream: onAddJD.stream || "",
    location: onAddJD.location || "",
    salary: onAddJD.salary || "",
    jobType: onAddJD.jobType || "",
    experience: onAddJD.experience || "",
    bond: onAddJD.bond || "",
    percentage: onAddJD.percentage || "",
    employeeName: loginEmployeeName,
    statusUpdateDate: getFormattedDateTime(),
    skills: onAddJD.skills || "",
    companyLink: onAddJD.companyLink || "",
    detailAddress: onAddJD.detailAddress || "",
    shift: onAddJD.shift || "",
    weekOff: onAddJD.weekOff || "",
    noticePeriod: onAddJD.noticePeriod || "",
    jobRole: onAddJD.jobRole || "",
    perks: onAddJD.perks || "",
    incentive: onAddJD.incentive || "",
    reportingHierarchy: onAddJD.reportingHierarchy || "",
    gender: onAddJD.gender || "",
    documentation: onAddJD.documentation || "",
    ageCriteria: onAddJD.ageCriteria || "",
    note: onAddJD.note || "",
    positionOverview: { overview: onAddJD.positionOverview?.overview || "" },
    responsibilities: onAddJD.responsibilities?.length
      ? onAddJD.responsibilities
      : [{ employeeId: "", responsibilitiesMsg: "" }],
    jobRequirements: onAddJD.jobRequirements?.length
      ? onAddJD.jobRequirements
      : [{ employeeId: "", jobRequirementMsg: "" }],
    preferredQualifications: onAddJD.preferredQualifications?.length
      ? onAddJD.preferredQualifications
      : [{ employeeId: "", preferredQualificationMsg: "" }],
  });

    // establishing socket for emmiting event
      useEffect(() => {
        const newSocket = getSocket();
        setSocket(newSocket);
      }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleInputChange = (e, field, index) => {
    const { name, value } = e.target;
    const newFormData = { ...formData };
    newFormData[field][index][name] = value;
    setFormData(newFormData);
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

  //   sahil karnekar line 128 to 202 date : 10-10-2024
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}/update-job-description/${onAddJD.requirementId}/${employeeId}/${userType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      console.log(response);
      if (response.ok) {
        console.log("API Object 001 :", JSON.stringify(formData, null, 2));
        socket.emit("update_job_description", formData);
        const result = await response.text();
        console.log(result);
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
          positionOverview: { overview: "", employeeId: "" },
          responsibilities: [{ employeeId: "", responsibilitiesMsg: "" }],
          jobRequirements: [{ employeeId: "", jobRequirementMsg: "" }],
          preferredQualifications: [
            { employeeId: "", preferredQualificationMsg: "" },
          ],
          // jdAddedDate:"",
        });

        toggleUpdateCompProp(false);
      } else {
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  // sahil karnekar
  const handleCloseButton = () => {
    toggleUpdateCompProp(false);
  };

  return (
    <main className="job-desc">
      <section className="job-performance">
        {/* Align AddJobDescription name center and changing color to gray */}

        <h3 className="text-center text-[18px] text-gray-500 py-2">
          Update Job Description
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="job-desc-form">
            <div className="field-column">
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Company Name:</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter Company Name"
                    required
                  />
                </div>
                <div className="field">
                  <label>Designation:</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Enter Designation"
                    required
                  />
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
                    placeholder="Number Of Position"
                  />
                </div>
                <div className="field">
                  <label>Qualification:</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="Enter Qualification"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Year of Passing:</label>
                  <input
                    type="text"
                    name="yearOfPassing"
                    value={formData.yearOfPassing}
                    onChange={handleChange}
                    placeholder="Enter Year of Passing"
                  />
                </div>
                <div className="field">
                  <label>Field:</label>
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    placeholder="Enter Field"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Stream:</label>
                  <input
                    type="text"
                    name="stream"
                    value={formData.stream}
                    onChange={handleChange}
                    placeholder="Enter Stream"
                  />
                </div>
                <div className="field">
                  <label>Location:</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter Location"
                    required
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Salary:</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter Salary"
                    required
                  />
                </div>
                <div className="field">
                  <label>Job Type:</label>
                  <select
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
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Experience:</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Enter Experience"
                    required
                  />
                </div>
                <div className="field">
                  <label>Bond:</label>
                  <input
                    type="text"
                    name="bond"
                    value={formData.bond}
                    onChange={handleChange}
                    placeholder="Ex. 2 Years or 3 Years"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Percentage:</label>
                  <input
                    type="text"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleChange}
                    placeholder="Enter Percentage"
                  />
                </div>
                <div className="field">
                  <label>Skills:</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Enter Skills"
                    required
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Company Link:</label>
                  <input
                    type="text"
                    name="companyLink"
                    value={formData.companyLink}
                    onChange={handleChange}
                    placeholder="Enter Company Link"
                  />
                </div>
                <div className="field">
                  <label>Detailed Address:</label>
                  <input
                    type="text"
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleChange}
                    placeholder="Enter Detailed Address"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Shift:</label>
                  <input
                    type="text"
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    placeholder="Enter Shift"
                  />
                </div>
                <div className="field">
                  <label>Week Off:</label>
                  <input
                    type="text"
                    name="weekOff"
                    value={formData.weekOff}
                    onChange={handleChange}
                    placeholder="Enter Week Off"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Notice Period:</label>
                  <input
                    type="text"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    placeholder="Enter Notice Period"
                  />
                </div>
                <div className="field">
                  <label>Job Role:</label>
                  <input
                    type="text"
                    name="jobRole"
                    value={formData.jobRole}
                    onChange={handleChange}
                    placeholder="Enter Job Role"
                  />
                </div>
              </div>
              <div className="field-Row-Gray">
                <div className="field">
                  <label>Perks:</label>
                  <input
                    type="text"
                    name="perks"
                    value={formData.perks}
                    onChange={handleChange}
                    placeholder="Enter Perks"
                  />
                </div>
                <div className="field">
                  <label>Incentive:</label>
                  <input
                    type="text"
                    name="incentive"
                    value={formData.incentive}
                    onChange={handleChange}
                    placeholder="Enter Incentive"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Reporting Hierarchy:</label>
                  <input
                    type="text"
                    name="reportingHierarchy"
                    value={formData.reportingHierarchy}
                    onChange={handleChange}
                    placeholder="Enter Reporting Hierarchy"
                  />
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
                  <input
                    type="text"
                    name="documentation"
                    value={formData.documentation}
                    onChange={handleChange}
                    placeholder="Enter Documentation"
                  />
                </div>
                <div className="field">
                  <label>Age Criteria:</label>
                  <input
                    type="text"
                    name="ageCriteria"
                    value={formData.ageCriteria}
                    onChange={handleChange}
                    placeholder="Enter Age Criteria"
                  />
                </div>
              </div>
              <div className="field-Row-white">
                <div className="field">
                  <label>Note:</label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Enter Note"
                  />
                </div>
                <div className="field">
                  <label>Position Overview:</label>
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
                    }}
                  />
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
                      <button
                        type="button"
                        className="job-remove-button"
                        onClick={() => handleRemove("responsibilities", index)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}

                <div className="ajd-btndiv-div">
                  <button
                    type="button"
                    className="job-button"
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
                      <button
                        type="button"
                        className="job-remove-button"
                        onClick={() => handleRemove("jobRequirements", index)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}

                <div className="ajd-btndiv-div">
                  <button
                    type="button"
                    className="job-button"
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
                          handleInputChange(e, "preferredQualifications", index)
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Preferred Qualification Message:</label>
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
                    className="job-button-add-Preferred"
                    onClick={() => handleAddMore("preferredQualifications")}
                  >
                    Add More Preferred Qualifications
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* sahil karnekar line 716 to 727 */}
          <div className="job-submit-button">
            <button className="daily-tr-btn" type="submit">
              Update
            </button>
            {/* sahil karnekar */}
            <button
              className="daily-tr-btn"
              style={{ marginLeft: "10px" }}
              onClick={handleCloseButton}
            >
              Close
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default UpdateJobDescription;
