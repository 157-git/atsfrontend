import React, { useState } from "react";
import "./ApplicantRegistration.css";

const ApplicantRegistraion = () => {
  const [formData, setFormData] = useState({
    applicantName: "",
    email: "",
    mobileNumber: "",
    dob: "",
    applyingPosition: "",
    gender: "",
    source: "",
    experienceType: "",
    totalExperience: "",
    experienceField: "",
    photo: null,
    resume: null,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log(formData);
  };

  return (
    <form className="registration-form" onSubmit={handleSubmit}>
      <div className="job-desc-form">
        <div className="field-column">
          <label>
            Applicant Name:
            <input
              type="text"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mobile Number:
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Applying Position:
            <select
              name="applyingPosition"
              value={formData.applyingPosition}
              onChange={handleChange}
              required
            >
              <option value="">Select Position</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Manager">Manager</option>
              <option value="Analyst">Analyst</option>
            </select>
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Source:
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
            >
              <option value="">Select Source</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Indeed">Indeed</option>
              <option value="Referral">Referral</option>
              <option value="Company Website">Company Website</option>
            </select>
          </label>
          <label>
            Experience:
            <select
              name="experienceType"
              value={formData.experienceType}
              onChange={handleChange}
              required
            >
              <option value="">Select Experience Type</option>
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>
          </label>
          {formData.experienceType === "Experienced" && (
            <>
              <label>
                Total Experience:
                <input
                  type="number"
                  name="totalExperience"
                  value={formData.totalExperience}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Experience Field:
                <input
                  type="text"
                  name="experienceField"
                  value={formData.experienceField}
                  onChange={handleChange}
                  required
                />
              </label>
            </>
          )}
          <label>
            Upload Photo:
            <input type="file" name="photo" onChange={handleChange} required />
          </label>
          <label>
            Upload Resume:
            <input type="file" name="resume" onChange={handleChange} required />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default ApplicantRegistraion;
