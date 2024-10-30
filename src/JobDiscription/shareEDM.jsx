import React, { useState, useEffect } from "react";
import "./shareEDM.css";
import profileImage from "../LogoImages/157careers_logo_LinkedIn.jpeg";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";

function ShareEDM({ Descriptions, onShareEdm }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { employeeId, userType } = useParams();

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/edm-details/${Descriptions}/${employeeId}/${userType}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
        setData({
          ...data,
          employeeName: data.employeeName.split(" ")[0] 
        });
      })
     
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const generateAndShareEDMImage = async () => {
    try {
      const input = document.getElementById("shareEMD");
      const canvas = await html2canvas(input, { scale: 2, logging: true });

      const imgName = `${data.designation}_job_description.png`;
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], imgName)] })
      ) {
        const file = new File([blob], imgName, { type: "image/png" });
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
        link.download = imgName;
        link.click();
      }
    } catch (error) {
      toast.error("Error generating image:", error);
    }
  };


  const closeJobDescrptionShare = () => {
    onShareEdm(false);
  };

  const handleInputChange = (e, field) => {
    
    setData({
      ...data,
      [field]: e.target.value, // Update the specific field in the state
    });
  };

  return (
    <div>
      {data && (
        <div className="shareEDMdiv">
          <div className="main-description-share2">
            <div className="job-posting" id="shareEMD">
              <div className="image-container">
                <img src={profileImage} alt="Profile Image" />
              </div>
              <h3 className="share-edm-black-bold"> We are Hiring </h3>
              <h2 className="short-edm-heading"> "{data.designation}"</h2>
              <div className="details">
                <h3 className="share-edm-black-skill">Required Key Skills</h3>
                <div className="skill-content">
                  <p className="share-edm-skill">Mandatory Skill :- {data.skills}</p>
                  <h3 className="share-edm-skill">
                    Experience Upto {data.experience}
                  </h3>
                  {/* <p className="share-edm-skill">The candidate must be a self-driven individual with excellent communication skills </p> */}
                  {/* <p  className="share-edm-skill">focused solely on Oracle PLSQL development.</p> */}
                  {/* <p  className="share-edm-skill">Strong in writing queries,</p> */}
                  {/* <p  className="share-edm-skill"></p> */}
                  <p className="share-edm-skill">Shift :- {data.shift} </p>
                  <p className="share-edm-skill">
                    Week Offs : - {data.weekOff}
                  </p>
                  <p className="share-edm-skill">
                  Notice Period : {data.noticePeriod}
                  {/* Notice Period : Immediate to 30 days */}
                  </p>
                </div>{" "}
                <br />
                <p className="share-edm-black-skill">
                  Salary upto {data.salary}{" "}
                </p>
                <p className="share-edm-black-bold-location">
                  {data.jobType}{" "}
                  <i
                    id="location-share-edm"
                    class="fa-solid fa-location-dot"
                  ></i>{" "}
                  {data.location}
                </p>
                <div className="contact">
                  <div className="details1">
                    <br />
                    <h3 className="share-edm-black-skill">For Details</h3>
                    <h4 className="share-edm-contact">Contact - 157  Careers</h4>
                    <div className="share-edm-contact-detaisl">
                      <input
                        id="employeeName"
                        value={data.employeeName}
                        onChange={(e) => handleInputChange(e, "employeeName")}
                        className="share-edm-input"
                      />{" | "}
                      <input
                        id="officialMail"
                        value={data.officialMail}
                        onChange={(e) => handleInputChange(e, "officialMail")}
                        className="share-edm-input"
                      />{" | "}
                      <input
                        type="tel"
                        id="officialContactNo"
                        value={data.officialContactNo}
                        onChange={(e) =>
                          handleInputChange(e, "officialContactNo")
                        }
                        className="share-edm-input"
                      />
                     </div>
                  </div>
                </div>
              </div>
            </div>
            <section className="apply-section-share">
              <button
                className="apply-button-share"
                onClick={generateAndShareEDMImage}
              >
                Share Job Description
              </button>
              <button
                onClick={closeJobDescrptionShare}
                className="apply-button-share"
              >
                Close
              </button>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareEDM;
