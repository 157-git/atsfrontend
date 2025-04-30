import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from "html2canvas";
import profileImage from '../assets/157logo.jpeg';
import { API_BASE_URL } from "../api/api";
import "./jobDescriptionEdm.css";
import profileImageRtempus from "../assets/rtempus.jpeg";
import profileImageVelocity from "../assets/velocityHr.png";



function JobDescriptionEdm({ Descriptions, onJobDescriptionEdm, descriptionFromTempGen }) {
  const [data, setData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const [voices, setVoices] = useState([]);
  const [voiceLoaded, setVoiceLoaded] = useState(false);
  const { employeeId, userType } = useParams()
console.log(Descriptions);

  useEffect(() => {

    if((Descriptions || employeeId || userType) === undefined){
      setData(descriptionFromTempGen);
    }else{
      fetch(`${API_BASE_URL}/edm-details/${Descriptions}/${employeeId}/${userType}`)
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
    }
  }, []);

console.log(data);


  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setVoiceLoaded(true);
    };

    if (!synth) {
      console.error('Speech synthesis not supported.');
      return;
    }

    fetchVoices();
    synth.onvoiceschanged = fetchVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, [synth]);


  const generateAndShareVideo = async () => {
    try {
      const input = document.getElementById("jobEDM");
      const canvas = await html2canvas(input, { scale: 2, logging: true });
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "video/mp4")
      );

      if (
        navigator.canShare &&
        navigator.canShare({ files: [new File([blob], "job_description.mp4")] })
      ) {
        const file = new File([blob], "job_description.mp4", {
          type: "video/mp4",
        });
        await navigator.share({
          title: Descriptions.designation,
          text: "Check out this job description.",
          files: [file],
        });
      } else {
        console.warn("Sharing not supported, downloading the image instead.");
        const imgData = canvas.toDataURL("video/mp4");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = Descriptions.designation;
        link.click();
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const closeJobDescrptionShare = () => {
    onJobDescriptionEdm(false)
    if (isPlaying) {
      if (synth.speaking) {
        synth.cancel();
      }
    }
  };
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const text = document.getElementById('shareEMD').innerText.trim();
      if (synth.speaking) {
        synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (voices.length > 0) {
        utterance.voice = voices[0]; // Use the first available voice
      } else {
        console.warn('No voices available.');
      }

      synth.speak(utterance);
      utteranceRef.current = utterance;

      utterance.onend = () => {
        setIsPlaying(false);
      };
    } else {
      synth.cancel();
    }
  };

  const handleInputChange = (e, field) => {
    setData({
      ...data,
      [field]: e.target.value, // Update the specific field
    });
  };
  const [downloadingImg, setDownloadImg] = useState(false);
  const generateAndDownloadVideo = async () => {
    setDownloadImg(true);
    try {
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
    } catch (error) {
      console.error("Error generating and downloading image:", error);
      setDownloadImg(false);
    }
    finally{
      setDownloadImg(false);
    }
  };
  if (!voiceLoaded) {
    return <div>Loading voices...</div>;
  }

  return (
    <div>
      <div className="shareEDMdiv">
        <div className="main-description-share2 newpositionfixedtosharedescriptionedms">
          <div className="job-posting" id="shareEMD">
            <div className="image-container">
            <img 
  src={
    employeeId === "3148" && userType === "TeamLeader"
      ? profileImageRtempus
      : employeeId === "3691" && userType === "TeamLeader"
      ? profileImageVelocity
       : data.image
      ? `${data.image}`
      : profileImage
  }
  alt="Profile Image"
/>

            </div>
            <h3 className="share-edm-black-bold"> We are Hiring</h3>
            <h2 className="short-edm-heading"> "{data.designation}"</h2>
            <div className="details">
            <h3 className="share-edm-black-skill">Required Key Skills</h3>
                <div className="skill-content">
                  <p className="share-edm-skill">{data.skills}</p>
                  <h3 className="share-edm-skill">
                    Experience Upto {data.experience}
                  </h3>
                  <p className="share-edm-skill">Shift :- {data.shift} </p>
                  <p className="share-edm-skill">
                    Week Offs : - {data.weekOff}
                  </p>
                  {/* <p className="share-edm-skill">
                    Pick-up and Drop facility available.
                  </p> */}
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
                  <h4 className="share-edm-contact">
                  {
    (employeeId === "3148" && userType === "TeamLeader") 
      ? "Contact - Rtempus Consulting Services" 
      : "Contact - 157 Careers"
  }
                  </h4>
                  <div className="share-edm-contact-detaisl">
  <div
    id="employeeName"
    contentEditable
    suppressContentEditableWarning
    onInput={(e) => handleInputChange(e, "employeeName")}
    className="share-edm-input newClassnameForSolveSoniaMaanProblem"
  >
    {data.employeeName}
  </div>
  {" | "}
  <div
    id="officialMail"
    contentEditable
    suppressContentEditableWarning
    onInput={(e) => handleInputChange(e, "officialMail")}
    className="share-edm-input newClassnameForSolveSoniaMaanProblem"
  >
    {data.officialMail}
  </div>
  {" | "}
  <div
    id="officialContactNo"
    contentEditable
    suppressContentEditableWarning
    onInput={(e) => handleInputChange(e, "officialContactNo")}
    className="share-edm-input newClassnameForSolveSoniaMaanProblem"
  >
    {data.officialContactNo}
  </div>
</div>

                </div>
              </div>
            </div>
            <button
            onClick={togglePlay}
            className="mt-4 bg-[#ffcb9b] hover:bg-white text-white hover:text-[#ffcb9b] shadow font-bold py-2 px-4 rounded transition duration-300"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          </div>
          
          <section className="apply-section-share">
            <button
              className="apply-button-share"
              onClick={generateAndShareVideo}
            >
              Share Job Description
            </button>
            <button
              className="apply-button-share"
              onClick={generateAndDownloadVideo}
            >
              Download Job Description
            </button>
            <button
             onClick={closeJobDescrptionShare}
              className="apply-button-share"
            >
              &#10006;
            </button>
          </section>
          
        </div>
        
      </div>
  </div>
);
}

export default JobDescriptionEdm;
