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
          employeeName: data.employeeName.split(" ")[0],
        });
      })

      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // line 27 to 49 added by sahil karnekar date 30-10-2024
  const handleContentChange = (event, field) => {
    const newText = event.target.innerText.replace(/^"|"$/g, ""); // Remove double quotes from start and end
    setData((prevData) => ({
      ...prevData,
      [field]: newText, // Update only the text inside the quotes
    }));
  };
  const generateAndShareEDMImage = async () => {
    const inputH3_1 = document.getElementById("extraField1");
    const inputH3_2 = document.getElementById("extraField2");
    const inputH3_3 = document.getElementById("extraField3");
    const extraF1 = inputH3_1.innerHTML;
    const extraF2 = inputH3_2.innerHTML;
    const extraF3 = inputH3_3.innerHTML;
    if (extraF1 === "Enter Extra Data Field 1...") {
      inputH3_1.style.display = "none";
    }
    if (extraF2 === "Enter Extra Data Field 2...") {
      inputH3_2.style.display = "none";
    }
    if (extraF3 === "Enter Extra Data Field 3...") {
      inputH3_3.style.display = "none";
    }
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
      // line 77 to 85 added by sahil karnekar date 30-10-2024
      inputH3_1.style.display = "block";
      inputH3_2.style.display = "block";
      inputH3_3.style.display = "block";
    } catch (error) {
      toast.error("Error generating image:", error);
      inputH3_1.style.display = "block";
      inputH3_2.style.display = "block";
      inputH3_3.style.display = "block";
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
  // line 100 to 113 added by sahil karnekar date 30-10-2024
  const handleRemoveInnerText = (event) => {
    const element = event.target;
    const placeholderTexts = [
      "Enter Extra Data Field 1...",
      "Enter Extra Data Field 2...",
      "Enter Extra Data Field 3...",
    ];

    // Check if the current text matches the placeholder and clear it if so
    if (placeholderTexts.includes(element.innerText)) {
      element.innerText = ""; // Clear the text
    }
  };
  const [downloadingImg, setDownloadImg] = useState(false);
  const generateAndDownloadEdmImage = async () => {
    setDownloadImg(true);
    try {
      const inputH3_1 = document.getElementById("extraField1");
      const inputH3_2 = document.getElementById("extraField2");
      const inputH3_3 = document.getElementById("extraField3");
      const extraF1 = inputH3_1.innerHTML;
      const extraF2 = inputH3_2.innerHTML;
      const extraF3 = inputH3_3.innerHTML;
      if (extraF1 === "Enter Extra Data Field 1...") {
        inputH3_1.style.display = "none";
      }
      if (extraF2 === "Enter Extra Data Field 2...") {
        inputH3_2.style.display = "none";
      }
      if (extraF3 === "Enter Extra Data Field 3...") {
        inputH3_3.style.display = "none";
      }
      const input = document.getElementById("shareEMD");
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

       // line 77 to 85 added by sahil karnekar date 30-10-2024
       inputH3_1.style.display = "block";
       inputH3_2.style.display = "block";
       inputH3_3.style.display = "block";
    } catch (error) {
      console.error("Error generating and downloading image:", error);
      setDownloadImg(false);
    }
    finally{
      setDownloadImg(false);
      inputH3_1.style.display = "block";
      inputH3_2.style.display = "block";
      inputH3_3.style.display = "block";
    }
  };
  return (
    <div>
      {data && (
        <div className="shareEDMdiv">
          <div className="main-description-share2">
            <div className="setCloseDivEdtSmall">
              <button
                onClick={closeJobDescrptionShare}
                className="apply-button-share"
              >
                &#10006;
              </button>
            </div>
            <div className="job-posting" id="shareEMD">
              <div className="image-container">
                <img src={profileImage} alt="Profile Image" />
              </div>
              {/* here are some code updated by sahil karnekar from line 114 to 330 date 30-10-2024 */}
              <div style={{ marginLeft: "10px", marginRight: "10px" }}>
                <h3
                  className="share-edm-black-bold"
                  contentEditable
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContentChange(e, "headingText")}
                >
                  {data.headingText || "We are Hiring"}
                </h3>
                {data.designation && (
                  <h2
                    className="short-edm-heading"
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleContentChange(e, "designation")}
                  >
                    "{data.designation}"
                  </h2>
                )}
                <div className="details">
                  <h3
                    className="share-edm-black-skill"
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      handleContentChange(e, "requiredSkillsHeading")
                    }
                  >
                    {data.requiredSkillsHeading || "Required Key Skills"}
                  </h3>
                  <div className="skill-content">
                    <p className="share-edm-skill">
                      {data.skills && (
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "mandSkills")}
                        >
                          {data.mandSkills || "Mandatory Skill :- "}
                        </span>
                      )}
                      {data.skills && (
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "skills")}
                        >
                          {data.skills}
                        </span>
                      )}
                    </p>
                    {data.experience && (
                      <h3 className="share-edm-skill">
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) =>
                            handleContentChange(e, "experienceUpto")
                          }
                        >
                          {data.experienceUpto || "Experience Upto "}
                        </span>
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "experience")}
                        >
                          {data.experience}
                        </span>
                      </h3>
                    )}
                    {/* <p className="share-edm-skill">The candidate must be a self-driven individual with excellent communication skills </p> */}
                    {/* <p  className="share-edm-skill">focused solely on Oracle PLSQL development.</p> */}
                    {/* <p  className="share-edm-skill">Strong in writing queries,</p> */}
                    {/* <p  className="share-edm-skill"></p> */}
                    {data.shift && (
                      <p className="share-edm-skill">
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "shiftHeadTxt")}
                        >
                          {data.shiftHeadTxt || "Shift :- "}
                        </span>
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "shift")}
                        >
                          {data.shift}
                        </span>
                      </p>
                    )}
                    {data.weekOff && (
                      <p className="share-edm-skill">
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "weekOffHead")}
                        >
                          {data.weekOffHead || "Week Offs : - "}
                        </span>
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "weekOff")}
                        >
                          {data.weekOff}
                        </span>
                      </p>
                    )}
                    {data.noticePeriod && (
                      <p className="share-edm-skill">
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) =>
                            handleContentChange(e, "noticePeriodHead")
                          }
                        >
                          {data.noticePeriodHead || "Notice Period : "}
                        </span>
                        <span
                          className="share-edm-skill"
                          contentEditable
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleContentChange(e, "noticePeriod")}
                        >
                          {data.noticePeriod}
                        </span>
                        {/* Notice Period : Immediate to 30 days */}
                      </p>
                    )}
                    <h3
                      id="extraField1"
                      className="share-edm-skill"
                      contentEditable
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleContentChange(e, "extra1")}
                      onClick={handleRemoveInnerText}
                    >
                      {data.extra1 || "Enter Extra Data Field 1..."}
                    </h3>
                    <h3
                      id="extraField2"
                      className="share-edm-skill"
                      contentEditable
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleContentChange(e, "extra2")}
                      onClick={handleRemoveInnerText}
                    >
                      {data.extra2 || "Enter Extra Data Field 2..."}
                    </h3>
                    <h3
                      id="extraField3"
                      className="share-edm-skill"
                      contentEditable
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleContentChange(e, "extra3")}
                      onClick={handleRemoveInnerText}
                    >
                      {data.extra3 || "Enter Extra Data Field 3..."}
                    </h3>
                    <br />
                  </div>{" "}
                  {data.salary && (
                    <p className="share-edm-black-skill">
                      <span
                        className="share-edm-black-skill"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleContentChange(e, "salaryUptoHead")}
                      >
                        {data.salaryUptoHead || "Salary Upto "}
                      </span>
                      <span
                        className="share-edm-black-skill"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleContentChange(e, "salary")}
                      >
                        {data.salary}{" "}
                      </span>
                    </p>
                  )}
                  {data.location && (
                    <p className="share-edm-black-bold-location">
                      {data.jobType}{" "}
                      <i
                        id="location-share-edm"
                        className="fa-solid fa-location-dot"
                      ></i>{" "}
                      <span
                        className="share-edm-black-bold-location"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleContentChange(e, "location")}
                      >
                        {data.location}{" "}
                      </span>
                    </p>
                  )}
                  <div className="contact">
                    <div className="details1">
                      <br />
                      <h3 className="share-edm-black-skill">For Details</h3>
                      <h4 className="share-edm-contact">
                        Contact - 157 Careers
                      </h4>
                      <div className="share-edm-contact-detaisl">
                        <input
                          id="employeeName"
                          value={data.employeeName}
                          onChange={(e) => handleInputChange(e, "employeeName")}
                          className="share-edm-input"
                        />
                        {" | "}
                        <input
                          id="officialMail"
                          value={data.officialMail}
                          onChange={(e) => handleInputChange(e, "officialMail")}
                          className="share-edm-input"
                        />
                        {" | "}
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
            </div>
            <div className="setDisplayFlextShareJd">
      <section className="apply-section-share">
        <button className="apply-button-share" onClick={generateAndShareEDMImage}>
          Share Job Description
        </button>
      </section>
      <section className="apply-section-share">
        <button className="apply-button-share" onClick={generateAndDownloadEdmImage}>
          Download Job Description
        </button>
      </section>
      </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareEDM;
