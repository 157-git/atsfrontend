import React, { useEffect, useState } from "react";
import "./shareDescription.css";
import html2canvas from "html2canvas";
import { API_BASE_URL } from "../api/api";
import { useParams } from "react-router-dom";
import LoginImage from "../LogoImages/LoginImge.jpg";

const ShareDescription = ({ Descriptions }) => {
  const [data, setData] = useState(null);
  const { employeeId, userType } = useParams();
  useEffect(() => {
    console.log(Descriptions);
  });

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/details-for-job-description/${employeeId}/${userType}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging: Log the entire response
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [employeeId, userType]);

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

  const handleInputChange = (e, field) => {
    setData({
      ...data,
      [field]: e.target.value, // Update the specific field
    });
  };

  return (
    <main className="main-description-share">
      <div className="job-post-share" id="job-description-share">
        <section className="job-details-section-share">
          <div className="job-title-share">
            <p className="job-title-share-title"
            contentEditable
            >
              !!.. We are Hiring For {Descriptions.designation} ..!!
            </p>
          </div>
          <hr />
          <div className="job-details-share">
            <div className="job-details-firstsection-share">
              <h2
                style={{
                  fontWeight: "bold",
                  textDecoration: "underline",
                  marginRight: "10px",
                }}
                contentEditable
              >
                Job Description
              </h2>
              <p>
                <b
                contentEditable
                >Company:</b>
                <a href={`${Descriptions.companyLink}`}>
                  {" "}
                  {Descriptions.companyName}
                </a>
              </p>
              <p
              contentEditable
              >
                <b
                contentEditable
                >Location:</b> {Descriptions.location}
              </p>
              <p contentEditable>
                <b contentEditable>Salary:</b> {Descriptions.salary}
              </p>
              <p contentEditable>
                <b contentEditable>Designation:</b> {Descriptions.designation}
              </p>
              <p contentEditable>
                <b contentEditable>Educational Qualifications:</b> {Descriptions.qualification}
              </p>
              <p contentEditable>
                <b contentEditable>Experience:</b> {Descriptions.experience}
              </p>
              <p contentEditable>
                <b contentEditable>Key Skills:</b> {Descriptions.skills}
              </p>
              <p contentEditable>
                <b contentEditable>Company Link:</b>{" "}
                <a href={`${Descriptions.companyLink}`}>
                  {Descriptions.companyLink}
                </a>
              </p>
              <p contentEditable>
                <b contentEditable>Address:</b> {Descriptions.detailAddress}
              </p>
              <p contentEditable>
                <b contentEditable>Shifts:</b> {Descriptions.shift}
              </p>
            </div>

            <div className="job-details-secondsection-share">
              <div className="jd-logo-div">
                <img src={LoginImage} alt="Logo" className="jd-logo" />
              </div>
              <div className="jd-logo-below-div">
                <p contentEditable>
                  <b contentEditable>Week Off's:</b> {Descriptions.weekOff}
                </p>
                <p contentEditable>
                  <b contentEditable>Notice Period:</b> {Descriptions.noticePeriod}
                </p>
                <p contentEditable>
                  <b contentEditable>Job Role:</b> {Descriptions.jobRole}
                </p>
                {/* <p>
                  <b>Incentives For Recruiters:</b> {Descriptions.incentive}
                </p> */}
                <p contentEditable>
                  <b contentEditable>Number of Positions:</b> {Descriptions.position}
                </p>
                <p id="job-roles-share">
                  <b contentEditable >Job Type:</b> <span contentEditable>{Descriptions.jobType}</span>
                </p>
                <p>
                  <b contentEditable>Perks:</b> <span contentEditable>{Descriptions.perks}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="positionOverview-share">
          <h2>
            <b contentEditable className="jd-sub-headings">Position Overview</b>
          </h2>
          <p contentEditable>{Descriptions.positionOverview.overview}</p>
        </section>
        <section className="responsibilities-share">
          <h2>
            <b contentEditable className="jd-sub-headings">Responsibilities</b>
          </h2>
          <div>
            {Descriptions.responsibilities.map((responsibilites) => (
              <div contentEditable key={responsibilites.responsibilitiesId}>
                <i className="fa-solid fa-arrow-right"></i>{" "}
                {responsibilites.responsibilitiesMsg}{" "}
              </div>
            ))}
          </div>
        </section>
        <section className="requirements-share">
          <h2>
            <b contentEditable className="jd-sub-headings">Requirements</b>
          </h2>
          <div>
            {Descriptions.jobRequirements.map((requirements) => (
              <div contentEditable key={requirements.jobRequirementId}>
                <i className="fa-solid fa-arrow-right"></i>{" "}
                {requirements.jobRequirementMsg}{" "}
              </div>
            ))}
          </div>
        </section>

        <section className="preferred-qualifications-share">
          <h2>
            <b contentEditable className="jd-sub-headings">Preferred Qualifications</b>
          </h2>
          <div>
            {Descriptions.preferredQualifications.map((qualifications) => (
              <div contentEditable key={qualifications.preferredQualificationId}>
                <i className="fa-solid fa-arrow-right"></i>{" "}
                {qualifications.preferredQualificationMsg}
              </div>
            ))}
          </div>
        </section>

        <section className="preferred-qualifications-share">
          <h2 contentEditable className="jd-sub-headings">Contact  Person</h2>
          <div className="jd-employeeinfo">
            <h2 className="share-jd-contact-div">
              <span contentEditable className="label">Name : </span> 
              <input
                value={data?.name.split(" ")[0] }
                onChange={(e) => handleInputChange(e, "name")}
                className="share-edm-input"
              />
            </h2>
            <h2 className="share-jd-contact-div">
              <span contentEditable className="label">Email : </span> 
              <input
                value={data?.email}
                onChange={(e) => handleInputChange(e, "email")}
                className="share-edm-input"
              />
            </h2>
            <h2 className="share-jd-contact-div">
              <span contentEditable className="label">Contact Number : </span> 
              <input
                type="tel"
                value={data?.contact}
                onChange={(e) => handleInputChange(e, "contact")}
                className="share-edm-input"
              />
            </h2>
          </div>
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
