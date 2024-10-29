import React, { useState, useEffect } from "react";
import "./addJobDescription.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../api/api";
// import WebSocketService from '../websocket/WebSocketService';
import Loader from "../EmployeeSection/loader";

const AddJobDescription = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    designation: "",
    position: "",
    qualification: "",
    year_of_passing: "",
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
    jdType: "",
    jdStatus: "",
    positionOverview: { overview: "", employeeId: "" },
    responsibilities: [{ employeeId: "", responsibilitiesMsg: "" }],
    jobRequirements: [{ employeeId: "", jobRequirementMsg: "" }],
    preferredQualifications: [
      { employeeId: "", preferredQualificationMsg: "" },
    ],
  });

  useEffect(() => {
    const formatDate = () => {
      const date = new Date();

      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      const hours = date.getHours() % 12 || 12; // convert 24-hour format to 12-hour
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = date.getHours() >= 12 ? "PM" : "AM";
      return `${day} ${month} ${year} - ${hours}:${minutes} ${ampm}`;
    };

    setFormData((prevFormData) => ({
      ...prevFormData,
      jdAddedDate: formatDate(),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  useEffect(() => {
    let subscription;
    const setupWebSocket = async () => {
      try {
        subscription = await WebSocketService.subscribeToNotifications(
          (notification) => {
            if (notification.type === "ADD") {
              toast.info(notification.message);
            }
          }
        );
      } catch (error) {
        console.error("Failed to subscribe to notifications:", error);
      }
    };

    setupWebSocket();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const handleRemove = (field, index) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch(`${API_BASE_URL}/add-requirement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response);
      if (response.ok) {
        const result = await response.text();
        setLoading(true);
        toast.success(result);
        setFormData({
          companyName: "",
          designation: "",
          position: "",
          qualification: "",
          year_of_passing: "",
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
          jdType: "",
          jdStatus: "",
          positionOverview: { overview: "", employeeId: "" },
          responsibilities: [{ employeeId: "", responsibilitiesMsg: "" }],
          jobRequirements: [{ employeeId: "", jobRequirementMsg: "" }],
          preferredQualifications: [
            { employeeId: "", preferredQualificationMsg: "" },
          ],
        });
      } else {
        toast.error(`Error: ${errorText}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
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
                          name="year_of_passing"
                          value={formData.year_of_passing}
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
                          name="job_type"
                          value={formData.job_type}
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
                          <option value="Hold">Hold</option>
                          <option value="Unhold">Unhold</option>
                        
                        </select>
                      </div>
                    </div>
                    {/* Arshad Attar Added New Code From Here , JD New fields 27-10-2024  */}

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
