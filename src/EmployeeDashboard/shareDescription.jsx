import React, { useEffect, useState } from "react";
import "./shareDescription.css";
import html2canvas from "html2canvas";
import { API_BASE_URL } from "../api/api";
import { useParams } from "react-router-dom";
import LoginImage from "../assets/157logo.jpeg";
import profileImageRtempus from "../assets/rtempus.jpeg";
import profileImageVelocity from "../assets/velocityHr.png";
import Item from "antd/es/list/Item";

const ShareDescription = ({ Descriptions }) => {
  const [data, setData] = useState(null);
  const { employeeId, userType } = useParams();
console.log(Descriptions);

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
    console.log(Descriptions);
    try {
      // line 37 to 43 added by sahil karnekar

      const editableElements = document.querySelectorAll("[contenteditable]");

      // Remove spaces only after the last character of the entire content
      editableElements.forEach((element) => {
        const cleanedContent = element.innerHTML.trimEnd(); // Trim spaces only at the end
        element.innerHTML = cleanedContent; // Update the element's text
      });

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
  const [downloadingImg, setDownloadImg] = useState(false);
  const generateAndDownloadImage = async () => {
    setDownloadImg(true);
    try {
      const input = document.getElementById("job-description-share");
      const canvas = await html2canvas(input, { scale: 2, logging: true });
  
      // Convert canvas to image URL
      const imgData = canvas.toDataURL("image/png");
  
      // Create a temporary anchor element for downloading
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "job_description.png"; // File name for the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Cleanup
    } catch (error) {
      console.error("Error generating and downloading image:", error);
      setDownloadImg(false);
    }
    finally{
      setDownloadImg(false);
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
      <section className="closeButtonDiv">
        <button
          onClick={closeJobDescrptionShare}
          className="apply-button-share"
        >
          &#10006;
        </button>
      </section>
      <div className="job-post-share" id="job-description-share"
       style={{
        backgroundColor: (employeeId === "3148" && userType === "TeamLeader")
          ? "#7f9a40"
          : (employeeId === "3691" && userType === "TeamLeader") 
          && "#b3a55b"
      }}
      >
        <section className="job-details-section-share">
          {Descriptions.designation && (
            <div className="job-title-share">
              <p className="job-title-share-title" contentEditable>
                We are Hiring For " {Descriptions.designation}"
              </p>
            </div>
          )}
          <hr />

          <div className="job-details-share">
            <div className="setEdmWith">
              <h2
                style={{
                  fontWeight: "bold",
                  paddingTop: "8px",
                  marginRight: "10px",
                  fontSize: "20px",
                }}
                contentEditable
              >
                Job Description
              </h2>
            </div>

            <div className="setDisplayFlexForEdm">
              <div className="job-details-firstsection-share"
            style={{
              borderRight:
                employeeId === "3148" && userType === "TeamLeader"
                  ? "2px solid #c11f21"
                  : employeeId === "3691" && userType === "TeamLeader"
                  ? "2px solid #3b3823"
                  : "none"
            }}
            
            
              >
                {/* {Descriptions.companyName && (
              <p
              contentEditable
              >
                <b
                contentEditable
                >Company Name:</b> {Descriptions.companyName}
              </p> )} */}

                {Descriptions.designation && (
                  <p contentEditable>
                    <b contentEditable>Designation:</b>{" "}
                    {Descriptions.designation}
                  </p>
                )}
                {Descriptions.jobRole && (
                  <p contentEditable>
                    <b contentEditable>Job Role:</b> {Descriptions.jobRole}
                  </p>
                )}
                {Descriptions.salary && (
                  <p contentEditable>
                    <b contentEditable>Salary:</b> {Descriptions.salary}
                  </p>
                )}
                {Descriptions.location && (
                  <p contentEditable>
                    <b contentEditable>Location:</b> {Descriptions.location}
                  </p>
                )}

                {Descriptions.qualification && (
                  <p contentEditable>
                    <b contentEditable>Educational Qualifications:</b>{" "}
                    {Descriptions.qualification}
                  </p>
                )}
                {Descriptions.experience && (
                  <p contentEditable>
                    <b contentEditable>Experience:</b> {Descriptions.experience}
                  </p>
                )}
                {Descriptions.skills && (
                  <p contentEditable>
                    <b contentEditable>Key Skills:</b> {Descriptions.skills.split(",").length > 0 ? Descriptions.skills.split(",").map((item, index)=>(
                      <>
                      {item}{index < Descriptions.skills.split(",").length - 1 ? ", " : ""}
                      </>
                    ) ) : null}
                  </p>
                )}

                {Descriptions.companyLink && (
                  <p contentEditable>
                    <b contentEditable>Company Link:</b>{" "}
                    <a href={`${Descriptions.companyLink}`}>
                      {Descriptions.companyLink}
                    </a>
                  </p>
                )}
                {Descriptions.detailAddress && (
                  <p contentEditable>
                    <b contentEditable>Address:</b> {Descriptions.detailAddress}
                  </p>
                )}
                {Descriptions.shift && (
                  <p contentEditable>
                    <b contentEditable>Shifts:</b> {Descriptions.shift}
                  </p>
                )}

                {Descriptions.noticePeriod && (
                  <p contentEditable>
                    <b contentEditable>Notice Period:</b>{" "}
                    {Descriptions.noticePeriod}
                  </p>
                )}
              </div>

              <div className="job-details-secondsection-share">
                <div className="jd-logo-div">
                   {/* <img 
                   className="jd-logo"
                                src={(employeeId === "3148" && userType === "TeamLeader") ? profileImageRtempus : LoginImage} 
                                alt="Profile Image" 
                              /> */}
                               <img 
                               className="jd-logo"
                                src={
                                  employeeId === "3148" && userType === "TeamLeader"
                                    ? profileImageRtempus
                                    : employeeId === "3691" && userType === "TeamLeader"
                                    ? profileImageVelocity
                                    : Descriptions.image
                                    ? `${Descriptions.image}`
                                    : LoginImage
                                }
                                alt="Profile Image"
                              />
                </div>
                <div className="jd-logo-below-div">
                  {Descriptions.weekOff && (
                    <p contentEditable>
                      <b contentEditable>Week Off's:</b> {Descriptions.weekOff}
                    </p>
                  )}

                  {/* <p>
                  <b>Incentives For Recruiters:</b> {Descriptions.incentive}
                </p> */}
                  {Descriptions.position > 0 && (
                    <p contentEditable>
                      <b contentEditable>Number of Positions:</b>{" "}
                      {Descriptions.position}
                    </p>
                  )}
                  {Descriptions.jobType && (
                    <p id="job-roles-share">
                      <b contentEditable>Job Type:</b>{" "}
                      <span contentEditable>{Descriptions.jobType}</span>
                    </p>
                  )}
                  {Descriptions.perks && (
                    <p>
                      <b contentEditable>Perks:</b>{" "}
                      <span contentEditable>{Descriptions.perks}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        {Descriptions.positionOverview.overview && (
          <section className="positionOverview-share">
            <h2>
              <b contentEditable className="jd-sub-headings">
                Position Overview
              </b>
            </h2>
            <p contentEditable>{Descriptions.positionOverview.overview}</p>
          </section>
        )}

        {Descriptions.responsibilities &&
          Descriptions.responsibilities.length > 0 &&
          Descriptions.responsibilities[0].responsibilitiesMsg !== "" && (
            <section className="responsibilities-share">
              <h2>
                <b contentEditable className="jd-sub-headings">
                  Responsibilities
                </b>
              </h2>
              <div>
                {Descriptions.responsibilities.map((responsibilites) => (
                  <div contentEditable key={responsibilites.responsibilitiesId}>
                    {responsibilites.responsibilitiesMsg && (
                      <i className="fa-solid fa-arrow-right"></i>
                    )}{" "}
                    {responsibilites.responsibilitiesMsg}{" "}
                  </div>
                ))}
              </div>
            </section>
          )}

        {Descriptions.jobRequirements &&
          Descriptions.jobRequirements.length > 0 &&
          Descriptions.jobRequirements[0].jobRequirementMsg !== "" && (
            <section className="requirements-share">
              <h2>
                <b contentEditable className="jd-sub-headings">
                  Requirements
                </b>
              </h2>
              <div>
                {Descriptions.jobRequirements.map((requirements) => (
                  <div contentEditable key={requirements.jobRequirementId}>
                    {requirements.jobRequirementMsg && (
                      <i className="fa-solid fa-arrow-right"></i>
                    )}{" "}
                    {requirements.jobRequirementMsg}{" "}
                  </div>
                ))}
              </div>
            </section>
          )}

        {Descriptions.preferredQualifications &&
          Descriptions.preferredQualifications.length > 0 &&
          Descriptions.preferredQualifications[0].preferredQualificationMsg !==
            "" && (
            <section className="preferred-qualifications-share">
              <h2>
                <b contentEditable className="jd-sub-headings">
                  Preferred Qualifications
                </b>
              </h2>
              <div>
                {Descriptions.preferredQualifications.map((qualifications) => (
                  <div
                    contentEditable
                    key={qualifications.preferredQualificationId}
                  >
                    {qualifications.preferredQualificationMsg && (
                      <i className="fa-solid fa-arrow-right"></i>
                    )}{" "}
                    {qualifications.preferredQualificationMsg}
                  </div>
                ))}
              </div>
            </section>
          )}

        <section className="preferred-qualifications-share">
          <h2 contentEditable className="jd-sub-headings">
            Contact Person
          </h2>
          <div className="jd-employeeinfo">
            <div className="share-jd-contact-div">
              <span contentEditable className="label">
                Name :{" "}
              </span>
              <input
                value={data?.name.split(" ")[0]}
                onChange={(e) => handleInputChange(e, "name")}
                className="share-edm-input"
              />
            </div>
            <div className="share-jd-contact-div">
              <span contentEditable className="label">
                Email :{" "}
              </span>
              <input
                value={data?.email || Descriptions.officialContactNo}
                onChange={(e) => handleInputChange(e, "email")}
                className="share-edm-input"
                style={{ width: "266px" }}
              />
            </div>
            <div className="share-jd-contact-div">
              <span contentEditable className="label">
                Contact Number :{" "}
              </span>
              <input
                type="tel"
                value={data?.contact || Descriptions.officialMail}
                onChange={(e) => handleInputChange(e, "contact")}
                className="share-edm-input"
              />
            </div>
          </div>
        </section>
      </div>
      <div className="setDisplayFlextShareJd">
      <section className="apply-section-share">
        <button className="apply-button-share" onClick={generateAndShareImage}>
          Share Job Description
        </button>
      </section>
      <section className="apply-section-share">
        <button className="apply-button-share" onClick={generateAndDownloadImage}>
          Download Job Description
        </button>
      </section>
      </div>
    </main>
  );
};

export default ShareDescription;
