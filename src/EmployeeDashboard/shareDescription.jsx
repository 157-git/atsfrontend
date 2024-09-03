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
    fetch(`${API_BASE_URL}/details-for-job-description/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);  // Debugging: Log the entire response
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


  return (
    <main className="main-description-share">
      <div className="job-post-share" id="job-description-share">
        <section className="job-details-section-share">

          <div className="job-title-share">
            <p className="job-title-share-title">!!..  We are Hiring For  {Descriptions.designation} ..!!</p>
          </div>
          <hr />
          <div className="job-details-share">
            <div className="job-details-firstsection-share">
              <h2 style={{ fontWeight: "bold", textDecoration: 'underline', marginRight: '10px' }} >Job Description</h2>

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

            <div className="job-details-secondsection-share" >
              <div className="jd-logo-div">
                <img src={LoginImage} alt="Logo" className="jd-logo" />
              </div>
              <div className="jd-logo-below-div">
                <p>
                  <b>Week Off's:</b> {Descriptions.weekOff}
                </p>
                <p>
                  <b>Notice Period:</b> {Descriptions.noticePeriod}
                </p>
                <p>
                  <b>Job Role:</b> {Descriptions.jobRole}
                </p>
                {/* <p>
                  <b>Incentives For Recruiters:</b> {Descriptions.incentive}
                </p> */}
                <p>
                  <b>Number of Positions:</b> {Descriptions.position}
                </p>
                <p id="job-roles-share">
                  <b>Job Type:</b> <span>{Descriptions.jobType}</span>
                </p>
                <p>
                  <b>Perks:</b> <span>{Descriptions.perks}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="positionOverview-share">
          <h2>
            <b className="jd-sub-headings">Position Overview</b>
          </h2>
          <p>{Descriptions.positionOverview.overview}</p>
        </section>
        <section className="responsibilities-share">
          <h2>
            <b className="jd-sub-headings">Responsibilities</b>
          </h2>
          <div>
            {Descriptions.responsibilities.map((responsibilites) => (
              <div key={responsibilites.responsibilitiesId}>
                <i className="fa-solid fa-arrow-right"></i> {responsibilites.responsibilitiesMsg}{" "}
              </div>
            ))}
          </div>
        </section>
        <section className="requirements-share">
          <h2>
            <b className="jd-sub-headings">Requirements</b>
          </h2>
          <div>
            {Descriptions.jobRequirements.map((requirements) => (
              <div key={requirements.jobRequirementId}>
                <i className="fa-solid fa-arrow-right"></i>  {requirements.jobRequirementMsg}{" "}
              </div>
            ))}
          </div>
        </section>

        <section className="preferred-qualifications-share">
          <h2>
            <b className="jd-sub-headings">Preferred Qualifications</b>
          </h2>
          <div>
            {Descriptions.preferredQualifications.map((qualifications) => (
              <div key={qualifications.preferredQualificationId}>
                <i className="fa-solid fa-arrow-right"></i>  {qualifications.preferredQualificationMsg}
              </div>
            ))}
          </div>
        </section>

        <section className="preferred-qualifications-share">
          <h2 className="jd-sub-headings">
            Contact Person
          </h2>
          <div className="jd-employeeinfo">
            <h2>
              <span className="label">Name : </span> - {data?.name?.split(' ')[0] || "Not available"}
            </h2>

            <h2>
              <span className="label">Email : </span> - {data?.email || "Not available"}
            </h2>
            <h2>
              <span className="label">Contact Number : </span> - {data?.contact || "Not available"}
            </h2>
          </div>

        </section>

      </div>
      <section className="apply-section-share">
        <button className="apply-button-share" style={{ paddingRight: "10px", paddingLeft: "10px", color: "black" }} onClick={generateAndShareImage}>
          Share Job Description
        </button>
        <button
          onClick={closeJobDescrptionShare}
          className="apply-button-share"
          style={{ paddingRight: "10px", paddingLeft: "10px", color: "black" }}
        >
          close
        </button>
      </section>
    </main>
  );
};

export default ShareDescription;
