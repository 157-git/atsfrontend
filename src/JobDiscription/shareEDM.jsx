import React, { useState, useEffect } from 'react';
import './shareEDM.css'
import profileImage from '../LogoImages/157logo.jpeg';
import { useParams } from 'react-router-dom';
import html2canvas from "html2canvas";
import { toast } from 'react-toastify';
import { API_BASE_URL } from "../api/api";



function ShareEDM({ Descriptions, onShareEdm }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const { employeeId } = useParams()

    useEffect(() => {
        fetch(`${API_BASE_URL}/edm-details/1/1`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setData(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);


    const generateAndShareEDMImage = async () => {
        try {
            const input = document.getElementById("shareEMD");
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
            toast.error("Error generating image:", error);
        }
    };

    const closeJobDescrptionShare = () => {
        onShareEdm(false);
    };



    return (
        <div>

            {data && (
                <div className='shareEDMdiv '>
                    <div className='main-description-share2'>

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
                                        {/* Use the imported image */}
                                        <img src={profileImage} alt="Profile Image" />
                                    </div>
                                    <div className="details1">
                                        <h4>For Details</h4>
                                        <p>Name : {data.employeeName} | Contact: {data.officialContactNo} </p>

                                        <p>Email: <a href="mailto:bezalwar@157ipl.com">{data.officialMail}</a> </p>

                                    </div>
                                </div>
                            </div>


                        </div>
                        <section className="apply-section-share">
                            <button className="apply-button-share" onClick={generateAndShareEDMImage}>
                                Share Job Description
                            </button>

                            <button onClick={closeJobDescrptionShare} className="apply-button-share">
                                close
                            </button>
                        </section>
                    </div>
                </div>
            )}




        </div>
    );
}

export default ShareEDM;