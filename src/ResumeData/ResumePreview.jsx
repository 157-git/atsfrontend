import React, { forwardRef } from "react";

const ResumePreview = forwardRef(({ data }, ref) => {
  if (!data) {
    return null;
  }

  return (
    <div ref={ref}>
      <div className="flex justify-center gap-2 font-bold">
        <h1 className="text-2xl">{data.firstname}</h1>
        <h1 className="text-2xl">{data.lastname}</h1>
      </div>
      <div className="flex justify-center gap-2 font-bold border-b">
        <p className="text-sm">{data.email}</p>
        <p className="text-sm">{data.phone}</p>
      </div>

      {data.summary && (
        <>
          <h2 className="font-bold">Summary</h2>
          <p className="text-sm">{data.summary}</p>
        </>
      )}

      {data.experiences && data.experiences.length > 0 && (
        <>
          <h2 className="font-bold">Experience</h2>
          {data.experiences.map((experience, index) => (
            <div key={index} className="w-full flex flex-col">
              <div className="w-full flex">
                <div className="w-3/4 flex-col items-start">
                  <h3 className="text-base font-semibold">
                    {experience.title}
                  </h3>
                  <h3 className="text-normal">{experience.company}</h3>
                </div>
                <p className="text-sm font-normal">
                  {experience.startDate} - {experience.endDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-normal">{experience.description}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {data.projects && data.projects.length > 0 && (
        <>
          <h2 className="font-bold">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index}>
              <h3 className="text-base font-semibold">{project.title}</h3>
              <p className="text-sm font-normal">{project.description}</p>
            </div>
          ))}
        </>
      )}

      {data.educations && data.educations.length > 0 && (
        <>
          <h2 className="font-bold">Education</h2>
          {data.educations.map((education, index) => (
            <div key={index} className="w-full flex justify-between">
              <div className="w-3/4">
                <h3 className="text-base font-semibold">
                  {education.institution}
                </h3>
                <h3 className="text-sm font-normal">{education.degree}</h3>
              </div>
              <p className="text-sm font-normal">
                {education.startDate} - {education.endDate}
              </p>
            </div>
          ))}
        </>
      )}

      {data.technicalSkills && (
        <>
          <h2 className="font-bold">Skills</h2>
          <h3 className="text-base font-semibold">Technical Skills</h3>
          <p className="text-sm font-normal">{data.technicalSkills}</p>
        </>
      )}

      {data.softSkills && (
        <>
          <h3 className="text-base font-semibold">Soft Skills</h3>
          <p className="text-sm font-normal">{data.softSkills}</p>
        </>
      )}
    </div>
  );
});

export default ResumePreview;
