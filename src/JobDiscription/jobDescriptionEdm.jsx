import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from "html2canvas";
import profileImage from '../LogoImages/157logo.jpeg';
import { API_BASE_URL } from "../api/api";
import "./jobDescriptionEdm.css"



function JobDescriptionEdm({ Descriptions, onJobDescriptionEdm }) {
  const [data, setData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const [voices, setVoices] = useState([]);
  const [voiceLoaded, setVoiceLoaded] = useState(false);
  const { employeeId, userType } = useParams()

  useEffect(() => {
    fetch(`${API_BASE_URL}/edm-details/${Descriptions}/${employeeId}/${userType}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
        console.log(Descriptions + "1st Attempt in video...");
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);



  useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      setVoiceLoaded(true);
    };

    // Check if speech synthesis is available
    if (!synth) {
      console.error('Speech synthesis not supported.');
      return;
    }

    // Fetch voices
    fetchVoices();

    // Update voices on voice change
    synth.onvoiceschanged = fetchVoices;

    return () => {
      // Clean up voice change listener
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

  if (!voiceLoaded) {
    return <div>Loading voices...</div>;
  }

  return (
    <>
      <div className="main-description-share1  min-h-screen  flex flex-col justify-center items-center" id='jobEDM'>
        <div className="job-posting" id='shareEMD'>
          <h3></h3>
          <h3>We are Hiring</h3>
          <h2> {data.designation}</h2>
          <div className="details">
            <h3 >Required Key Skills</h3>
            <p> {data.skills}</p>
            <br />
            <h3>Team Handling experience is must.</h3>
            <p>Relevant Experience {data.experience}</p>
            <br />
            <p className="salary">Salary upto {data.salary} LPA</p>
            <p>{data.jobType} - {data.detailAddress}</p>
            <div className="contact">
              <div className="image-container">
                <img src={profileImage} alt="Profile Image" />
              </div>
              <div className="details1">
                <h4>For Details</h4>
                <p>Name : {data.employeeName} | Contact: {data.officialContactNo} </p>
                <p>Email: <a href="mailto:bezalwar@157ipl.com">{data.officialMail}</a> </p>
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
          <button className="apply-button-share"  style={{paddingRight:"10px",paddingLeft:"10px",color:"black"}}  onClick={generateAndShareVideo}>
            Share Job Description
          </button>

          <button
            onClick={closeJobDescrptionShare}
            className="apply-button-share"
            style={{paddingRight:"10px",paddingLeft:"10px",color:"black"}} 
          >
            close
          </button>
        </section>
      </div>
    </>
  );
}

export default JobDescriptionEdm;
