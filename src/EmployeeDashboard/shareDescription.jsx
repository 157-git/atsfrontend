import React, { useEffect, useState } from "react";
import "./shareDescription.css";
import html2canvas from "html2canvas";

const ShareDescription = ({ Descriptions }) => {
  useEffect(() => {
    console.log(Descriptions);
  });

  const closeJobDescrptionShare = (e) => {
    e.preventDefault();
    document.querySelector(".main-description-share").style.display = "none";
  };
  const generateAndShareImage = async () => {
    try {
      const input = document.getElementById("job-description-share");
      const canvas = await html2canvas(input, { scale: 2, logging: true });
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], "job_description.png")] })
      ) {
        const file = new File([blob], "job_description.png", {
          type: "image/png",
        });
        await navigator.share({
          title: Descriptions.designation,
          text: "Check out this job description.",
          files: [file],
        });
      } else {
        console.warn("Sharing not supported, downloading the image instead.");
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = Descriptions.designation;
        link.click();
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };


  return (
    <main className="main-description-share">
      <div className="job-post-share" id="job-description-share">
        <section className="job-details-section-share">
          <h2 className="job-title-share">
            {Descriptions.designation}
          </h2>
          <div className="job-details-share">
            <div className="job-details-firstsection-share">
              <p>
                <b>Company:</b>
                <a href={`${Descriptions.companyLink}`}>
                  {" "}
                  {Descriptions.companyName}
                </a>
              </p>
              <p>
                <b>Location:</b> {Descriptions.location}
              </p>
              <p>
                <b>Salary:</b> {Descriptions.salary}
              </p>
              <p>
                <b>Designation:</b> {Descriptions.designation}
              </p>
              <p>
                <b>Educational Qualifications:</b> {Descriptions.qualification}
              </p>
              <p>
                <b>Experience:</b> {Descriptions.experience}
              </p>
              <p>
                <b>Key Skills:</b> {Descriptions.skills}
              </p>
              <p>
                <b>Company Link:</b>{" "}
                <a href={`${Descriptions.companyLink}`}>
                  {Descriptions.companyLink}
                </a>
              </p>
              <p>
                <b>Address:</b> {Descriptions.detailAddress}
              </p>
              <p>
                <b>Shifts:</b> {Descriptions.shift}
              </p>
            </div>
            <div className="job-details-secondsection-share">
              <p>
                <b>Week Off's:</b> {Descriptions.weekOff}
              </p>
              <p>
                <b>Notice Period:</b> {Descriptions.noticePeriod}
              </p>
              <p>
                <b>Job Role:</b> {Descriptions.jobRole}
              </p>
              <p>
                <b>Incentives For Recruiters:</b> {Descriptions.incentive}
              </p>
              <p>
                <b>Number of Positions:</b> {Descriptions.position}
              </p>
              <p id="job-roles-share">
                <b>Job Type:</b> <span>{Descriptions.jobType}</span>
              </p>
              <p>
                <b>Perks:</b>
              </p>
              <ul>
                {Descriptions.perks.split(",").map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="positionOverview-share">
          <h2>
            <b>Position Overview</b>
          </h2>
          <p>{Descriptions.positionOverview.overview}</p>
        </section>
        <section className="responsibilities-share">
          <h2>
            <b>Responsibilities</b>
          </h2>
          <ul>
            {Descriptions.responsibilities.map((responsibilites) => (
              <li key={responsibilites.responsibilitiesId}>
                {responsibilites.responsibilitiesMsg}{" "}
              </li>
            ))}
          </ul>
        </section>
        <section className="requirements-share">
          <h2>
            <b>Requirements</b>
          </h2>
          <ul>
            {Descriptions.jobRequirements.map((requirements) => (
              <li key={requirements.jobRequirementId}>
                {requirements.jobRequirementMsg}{" "}
              </li>
            ))}
          </ul>
        </section>
        <section className="preferred-qualifications-share">
          <h2>
            <b>Preferred Qualifications</b>
          </h2>
          <ul>
            {Descriptions.preferredQualifications.map((qualifications) => (
              <li key={qualifications.preferredQualificationId}>
                {qualifications.preferredQualificationMsg}{" "}
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="apply-section-share">
        <button className="apply-button-share" onClick={generateAndShareImage}>
          Share Job Description
        </button>
        <button
          onClick={closeJobDescrptionShare}
          className="apply-button-share"
        >
          close
        </button>
      </section>
    </main>
  );
};

export default ShareDescription;
