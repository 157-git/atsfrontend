
// Akash pawar CandidateResumeLink 11/2024
import React, { forwardRef } from "react";

const ResumePreview = forwardRef(({ data }, ref) => {
  if (!data) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="mx-auto my-0 bg-white text-gray-800 font-sans p-6"
    >
      {/* Header Section */}
      {data.profileImage ? (
        <header className="text-center mb-6">
          <div className="flex  items-center gap-2 font-bold">
            <img
              src={URL.createObjectURL(data.profileImage)}
              alt="Profile Preview"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="">
              <div className="font-bold flex gap-2">
                <h1 className="text-3xl">{data.firstname.toUpperCase()}</h1>
                <h1 className="text-3xl">{data.lastname.toUpperCase()}</h1>
              </div>
              <p className="text-sm text-left uppercase mt-1">
                {data.experiences[0]?.title}
              </p>
            </div>
          </div>
        </header>
      ) : (
        <header className="text-center mb-6">
          <div className="flex justify-center items-center gap-2 font-bold">
            <h1 className="text-3xl">{data.firstname.toUpperCase()}</h1>
            <h1 className="text-3xl">{data.lastname.toUpperCase()}</h1>
          </div>
          <p className="text-lg uppercase mt-1">{data.experiences[0]?.title}</p>
        </header>
      )}
      <hr className="border-t border-gray-500 mb-6" />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-5">
          {data.phone && (
            <div className="mb-6 pb-2 border-b border-dotted border-gray-600">
              <h2 className="font-bold text-lg text-left mb-2">CONTACT</h2>
              <p className="mb-1">
                <span className="font-semibold">Phone:</span> {data.phone}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Email:</span> {data.email}
              </p>
            </div>
          )}

          {/* Education Section */}
          {data.educations[0].degree != "" && (
            <div className="mb-6 pb-2 border-b border-dotted border-gray-600">
              <h2 className="font-bold text-lg text-left mb-2">EDUCATION</h2>
              {data.educations?.map((education, index) => (
                <div key={index} className="mb-2">
                  <p className="font-semibold">{education.degree}</p>
                  <p className="flex justify-between text-sm">
                    {education?.institution}
                    <span className="text-sm">
                      {new Date(education?.endDate)?.getUTCFullYear()}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Technical Skills Section */}
          {data.technicalSkills && (
            <div className="mb-6 pb-2 border-b border-dotted border-gray-600">
              <h2 className="font-bold text-lg text-left mb-2">
                TECHNICAL SKILLS
              </h2>
              <ul className="list-disc list-inside space-y-1">
                {data.technicalSkills.split(",").map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Soft Skills Section */}
          {data.softSkills && (
            <div className="mb-6 pb-2 border-b border-dotted border-gray-600">
              <h2 className="font-bold text-lg text-left mb-2">SOFT SKILLS</h2>
              <ul className="list-disc list-inside space-y-1">
                {data.softSkills.split(",").map((softSkill, index) => (
                  <li key={index}>{softSkill}</li>
                ))}
              </ul>
            </div>
          )}

          {data.personalDetails.dateOfBirth != "" ||
            (data.personalDetails.gender != "" && (
              <div className="mb-6">
                <h2 className="font-bold text-lg text-left mb-2">
                  Personal Details
                </h2>

                <p>
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {data.personalDetails.dateOfBirth}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {data.personalDetails.gender}
                </p>
                <p>
                  <span className="font-semibold">Father's Name:</span>{" "}
                  {data.personalDetails.fatherName}
                </p>
                <p>
                  <span className="font-semibold">Marital Status:</span>{" "}
                  {data.personalDetails.married}
                </p>
                {data.personalDetails.married === "Married" && (
                  <p>
                    <span className="font-semibold">Spouse Name:</span>{" "}
                    {data.personalDetails.spouseName}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Passport Number:</span>{" "}
                  {data.personalDetails.passportNumber}
                </p>
                <p>
                  <span className="font-semibold">Valid Till:</span>{" "}
                  {data.personalDetails.validTill}
                </p>
                <p>
                  <span className="font-semibold">Visa Status:</span>{" "}
                  {data.personalDetails.visaStatus}
                </p>
              </div>
            ))}
        </div>

        {/* Right Column */}
        <div className="col-span-7">
          {/* Profile Section */}
          {data.summary && (
            <div className="mb-6 pb-2 border-b border-dotted border-gray-600">
              <h2 className="font-bold text-lg text-left mb-2">PROFILE</h2>
              <p className="leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience Section */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="mb-6 pb-2 border-b border-dotted border-gray-600">
              <h2 className="font-bold text-lg text-left mb-2">EXPERIENCE</h2>
              {data.experiences.map((experience, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between">
                    <p className="font-semibold">{experience.company}</p>
                    <p className="text-sm">
                      {experience.startDate} - {experience.endDate}
                    </p>
                  </div>
                  <p className="italic mb-2">Role: {experience.title}</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    {experience.description.split(/\.|\n/).map((desc, i) => (
                      <li key={i}>{desc.trim()}</li> // `trim()` to remove any extra whitespace
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Projects Section */}
          {data.projects[0].title != "" && (
            <div className="mb-6">
              <h2 className="font-bold text-lg text-left mb-2">PROJECTS</h2>
              {data.projects?.map((project, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-base font-semibold">{project.title}</h3>
                  <p className="text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default ResumePreview;
// Akash pawar CandidateResumeLink 11/2024
