import React from "react";

const ResumeForm = ({ formData, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const experiences = [...formData.experiences];
    experiences[index][name] = value;
    onChange({ ...formData, experiences });
  };

  const addExperience = () => {
    const experiences = [
      ...formData.experiences,
      { title: "", company: "", startDate: "", endDate: "", description: "" },
    ];
    onChange({ ...formData, experiences });
  };

  const removeExperience = (index) => {
    const experiences = formData.experiences.filter((_, i) => i !== index);
    onChange({ ...formData, experiences });
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const projects = [...formData.projects];
    projects[index][name] = value;
    onChange({ ...formData, projects });
  };

  const addProject = () => {
    const projects = [...formData.projects, { title: "", description: "" }];
    onChange({ ...formData, projects });
  };

  const removeProject = (index) => {
    const projects = formData.projects.filter((_, i) => i !== index);
    onChange({ ...formData, projects });
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const education = [...formData.educations];
    education[index][name] = value;
    onChange({ ...formData, education });
  };

  const addEducation = () => {
    const education = [
      ...formData.education,
      { institution: "", degree: "", startDate: "", endDate: "" },
    ];
    onChange({ ...formData, education });
  };

  const removeEducation = (index) => {
    const education = formData.education.filter((_, i) => i !== index);
    onChange({ ...formData, education });
  };

  const handleSkillChange = (type, e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    try {
      const response = await fetch("http://192.168.1.42:8891/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const responseData = response;
      if (response.ok) {
        console.log("Resume saved successfully:", responseData);
        alert("Resume saved successfully!");
      } else {
        console.error("Failed to save resume:", responseData);
        alert(`Failed to save resume: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving the resume.");
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      {/* Profile Section */}
      <div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="flex flex-col text-[18px] text-gray-700">
            First Name:
            <input
              name="firstname"
              placeholder="Enter First Name"
              className="px-2 py-1 text-base font-normal border rounded-md"
              value={formData.firstname}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col text-[18px] text-gray-700">
            Last Name:
            <input
              name="lastname"
              placeholder="Enter Last Name"
              className="px-2 py-1 text-base font-normal border rounded-md"
              value={formData.lastname}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="flex flex-col text-[18px] text-gray-700">
            Phone Number:
            <input
              name="phone"
              placeholder="Enter Phone Number"
              className="px-2 py-1 text-base font-normal border rounded-md"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-col text-[18px] text-gray-700">
            Email:
            <input
              name="email"
              placeholder="Enter Email"
              className="px-2 py-1 text-base font-normal border rounded-md"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      {/* Summary Section */}
      <div className="space-y-2">
        <label className="text-[18px] text-gray-700">Profile Summary:</label>
        <textarea
          name="summary"
          className="w-full px-2 py-1 text-base border rounded-md"
          placeholder="Summary"
          value={formData.summary}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* Experience Section */}
      <div className="space-y-4">
        <h3 className="text-[18px] text-gray-700">Experience:</h3>
        {formData.experiences.map((experience, index) => (
          <div key={index} className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                name="title"
                placeholder="Job Title"
                className="px-2 py-1 text-base font-normal border rounded-md"
                value={experience.title}
                onChange={(e) => handleExperienceChange(index, e)}
              />
              <input
                name="company"
                placeholder="Company"
                className="px-2 py-1 text-base font-normal border rounded-md"
                value={experience.company}
                onChange={(e) => handleExperienceChange(index, e)}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="flex flex-col text-[18px] text-gray-700">
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  className="px-2 py-1 text-base font-normal border rounded-md"
                  value={experience.startDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </label>
              <label className="flex flex-col text-[18px] text-gray-700">
                End Date:
                <input
                  type="date"
                  name="endDate"
                  className="px-2 py-1 text-base font-normal border rounded-md"
                  value={experience.endDate}
                  onChange={(e) => handleExperienceChange(index, e)}
                />
              </label>
            </div>
            <div className="flex flex-col items-start space-y-2">
              <textarea
                name="description"
                placeholder="Description"
                className="w-full px-2 py-1 text-base text-gray-400 border rounded-md"
                value={experience.description}
                onChange={(e) => handleExperienceChange(index, e)}
              ></textarea>
              <button
                type="button"
                className="border px-1 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
                onClick={() => removeExperience(index)}
              >
                Remove Experience
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="border px-1 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
          onClick={addExperience}
        >
          Add Experience
        </button>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <h3 className="text-[18px] text-gray-700">Projects:</h3>
        {formData.projects.map((project, index) => (
          <div key={index} className="space-y-4">
            <input
              name="title"
              placeholder="Project Title"
              className="w-full px-2 py-1 text-base border rounded-md"
              value={project.title}
              onChange={(e) => handleProjectChange(index, e)}
            />
            <textarea
              name="description"
              placeholder="Project Description"
              className="w-full px-2 py-1 text-base border rounded-md"
              value={project.description}
              onChange={(e) => handleProjectChange(index, e)}
            ></textarea>
            <button
              type="button"
              className="border px-1 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
              onClick={() => removeProject(index)}
            >
              Remove Project
            </button>
          </div>
        ))}
        <button
          type="button"
          className="border px-1 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
          onClick={addProject}
        >
          Add Project
        </button>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <h3 className="text-[18px] text-gray-700">Education:</h3>
        {formData.educations.map((education, index) => (
          <div key={index} className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                name="degree"
                placeholder="Degree"
                className="w-full px-2 py-1 text-base border rounded-md"
                value={education.degree}
                onChange={(e) => handleEducationChange(index, e)}
              />
              <input
                name="institution"
                placeholder="Institution"
                className="px-2 py-1 text-base border rounded-md"
                value={education.institution}
                onChange={(e) => handleEducationChange(index, e)}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="flex flex-col text-[18px] text-gray-700">
                Start Date:
                <input
                  type="date"
                  name="startDate"
                  className="px-2 py-1 text-base border rounded-md"
                  value={education.startDate}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </label>
              <label className="flex flex-col text-[18px] text-gray-700">
                End Date:
                <input
                  type="date"
                  name="endDate"
                  className="px-2 py-1 text-base border rounded-md"
                  value={education.endDate}
                  onChange={(e) => handleEducationChange(index, e)}
                />
              </label>
            </div>
            <div className="flex flex-col items-start space-y-2">
              <button
                type="button"
                className="border px-1 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
                onClick={() => removeEducation(index)}
              >
                Remove Education
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="border px-1 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
          onClick={addEducation}
        >
          Add Education
        </button>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[18px] text-gray-700">Technical Skills:</h3>
          <input
            name="technicalSkills"
            placeholder="Enter technical skills separated by commas"
            className="w-full px-2 py-1 text-base border rounded-md"
            value={formData.technicalSkills}
            onChange={(e) => handleSkillChange("technicalSkills", e)}
          />
        </div>
        <div>
          <h3 className="text-[18px] text-gray-700">Soft Skills:</h3>
          <input
            name="softSkills"
            placeholder="Enter soft skills separated by commas"
            className="w-full px-2 py-1 text-base border rounded-md"
            value={formData.softSkills}
            onChange={(e) => handleSkillChange("softSkills", e)}
          />
        </div>
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        className="border mt-3 px-2 py-1 bg-[#ffcb9b] text-white rounded-[15px] hover:bg-white hover:text-[#ffcb9b]"
      >
        Save Resume
      </button>
    </form>
  );
};

export default ResumeForm;
