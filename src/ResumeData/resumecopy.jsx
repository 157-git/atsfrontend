import { useState, useRef, useEffect } from "react";
import "./resumeCopy.css";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import resumephoto from "../photos/resumephoto.jpg";
import penPhoto from "../photos/pen.png";
import callImg from "../photos/call.png";
import emailImg from "../photos/email.png";
import pinImg from "../photos/pin.png";

// Afreen Sanaulla
// title: Resume
// Description: Single page resucdme with character limit, id completely editable and has option of downloading as pdf
// Lines: 971

const ResumeCopy = ({ ResumeFromApplicantForm, onClose, onCVDownload, onSetCV, onBack }) => {
  // Ensure onBack is a function to prevent errors
  const handleBack = () => {
    // If we're in preview mode, go back to form view
    if (stateforToggleResumePreview) {
      setStateforToggleResumePreview(false)
      setStateForReumeToggleForm(true)
    } else if (typeof onBack === "function") {
      // If we're in form view, go back to format selection
      onBack()
    }
  }
  // Ensure onClose is a function to prevent errors
  const handleClose = () => {
    // Instead of closing the modal, return to the form view
    if (stateforToggleResumePreview) {
      setStateforToggleResumePreview(false)
      setStateForReumeToggleForm(true)
    } else if (typeof onClose === "function") {
      // Only call onClose if we're already on the form view
      onClose()
    }
  }
  const [stateforToggleResumePreview, setStateforToggleResumePreview] = useState(false)
  const [stateforToggleResumePreviewForm, setStateForReumeToggleForm] = useState(true)

  const printPDF = () => {
    window.print()
  }

  const [profile, setProfile] = useState({
    sectionTitles: {
      aboutMe: "About Me",
      skills: "Skills",
      education: "Education",
      experience: "Experience",
      projects: "Projects",
      personalDetails: "Personal Details",
    },
    subTitles: {
      d: "Date of Birth:",
      g: "Gender:",
      fn: "Father's Name:",
      m:  "Married:",
      pn: "Passport Number:",
      vt: "Valid Till:",
      vs:  "Visa Status:",
    },
    summary: {
      aboutMe:  "   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    title: {
      name:  "OLIVIA SCHUMACHER",
      designation:  "Business Consultant",
    },
    contact: {
      phone:  "9876543210",
      email:  "abc@gmail.com",
      address: ResumeFromApplicantForm ? "" : "Camp, Pune, Maharashtra - 411037",
    },

    imageSrc: resumephoto,

    education: {
      college: ResumeFromApplicantForm ? "" : "Ness Wadia College",
      course: ResumeFromApplicantForm ? "" : "Bachelors of Business Administration",
      dates: ResumeFromApplicantForm ? "" : "2018-2021",
    },
    skills: {
      technical: ResumeFromApplicantForm ? [] : ["ReactJS", "SpringBoot", "Bootstrap", "UI", "UX"],
      soft: ResumeFromApplicantForm
        ? []
        : ["Communication", "Problem-Solving", "Adaptability", "Teamwork", "Emotional Intelligence"],
    },
    sectionHeadings: {
      technical: ResumeFromApplicantForm ? "" : "Technical",
      soft: ResumeFromApplicantForm ? "" : "Soft Skills",
    },
    experience: [
      {
        title: ResumeFromApplicantForm ? "" : "Business Consultant",
        company: ResumeFromApplicantForm ? "" : "157 Industries Pvt Ltd",
        dates:  "1/13/25 - Present",
        description:  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatum harum iste earum maiores excepturi blanditiis doloribus sed nam ab aperiam corporis deserunt possimus.",
      },
      //   {
      //     title: "Business Consultant",
      //     company: "157 Industries Pvt Ltd",
      //     dates: "1/13/25 - Present",
      //     description:
      //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi voluptatum harum iste earum maiores excepturi blanditiis doloribus sed nam ab aperiam corporis deserunt possimus.",
      //   },
    ],
    projects: [
      {
        title: ResumeFromApplicantForm ? "" : "E-commerce",
        description:  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam modi id cumque, ducimus pariatur, veniam, iure autem ipsa ipsam sunt animi.",
      },
      //   {
      //     title: "E-commerce",
      //     description:
      //       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque quibusdam modi id cumque, ducimus pariatur, veniam, iure autem ipsa ipsam sunt animi.",
      //   },
    ],
    personalDetails: {
      dob: ResumeFromApplicantForm ? "" : "1/2/2000",
      gender: ResumeFromApplicantForm ? "" : "Female",
      fatherName: ResumeFromApplicantForm ? "" : "Sanaulla MB",
      married: ResumeFromApplicantForm ? "" : "No",
      passportNumber: ResumeFromApplicantForm ? "" : "xyz 098765",
      validTill: ResumeFromApplicantForm ? "" : "1/2/2030",
      visaStatus: ResumeFromApplicantForm ? "" : "Not required",
    },
  })
  // Rajlaxmi jagadale added taht code line 131/270
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    // Get the content to print
    const contentToPrint = document.querySelector(".resumemainresumecopytempleted").cloneNode(true)

    // Remove the download button from the print content
    const buttonDiv = contentToPrint.querySelector(".buttondivcvtemplete")
    if (buttonDiv) {
      buttonDiv.remove()
    }

    // Remove the close button from the print content
    const closeBtn = contentToPrint.querySelector(".resume-close-btn")
    if (closeBtn) {
      closeBtn.remove()
    }

    // Create HTML content for the print window
    printWindow.document.write(`
    <html>
      <head>
        <title>${profile.title.name} - CV</title>
        <style>
          ${document.querySelector("style") ? document.querySelector("style").innerHTML : ""}
          body { 
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }
          .buttondivcvtemplete, .resume-close-btn { 
            display: none !important; 
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0;
              padding: 0;
            }
            .resumemainresumecopytempleted {
              width: 100%;
              margin: 0;
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        ${contentToPrint.outerHTML}
        <script>
          // Auto-print when loaded
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Optional: close the window after printing
              // window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `)

    printWindow.document.close()
  }
  const handleSetCV = () => {
    const element = document.querySelector(".resumemainresumecopytempleted")

    if (!element) {
      console.error("Element not found for PDF generation")
      return
    }

    // Hide the form and buttons temporarily
    if (formRef.current) {
      formRef.current.style.display = "none"
    }

    const candidateIdElements = document.querySelectorAll(
      ".candidateidresumecopytemplete, .candidateidcvtemplete-top-close-div",
    )
    candidateIdElements.forEach((el) => {
      el.style.display = "none"
    })

    const buttonDiv =
      element.querySelector(".buttondivresumecopytemplete") || element.querySelector(".buttondivcvtemplete")
    if (buttonDiv) {
      buttonDiv.style.display = "none"
    }

    // Options for html2pdf.js
    const options = {
      filename: `${profile.title.name.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    // Generate the PDF but don't save it, just pass to parent component
    html2pdf()
      .from(element)
      .set(options)
      .outputPdf("datauristring")
      .then((pdfData) => {
        // Pass the PDF data to the parent component
        if (typeof onSetCV === "function") {
          onSetCV(pdfData)
        }

        // Restore the elements after PDF generation
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.style.display = "block"
          }

          candidateIdElements.forEach((el) => {
            el.style.display = "block"
          })

          if (buttonDiv) {
            buttonDiv.style.display = "block"
          }
        }, 1000)
      })
  }

  const [resumeData, setResumeData] = useState({})
  // const handleChange = (e, field) => {
  //   const { name, value } = e.target;
  //   setProfile((prevProfile) => ({
  //     ...prevProfile,
  //     [field]: value,
  //   }));
  // };

  // original handle chnage

  // updated handle change
  // Handle changes in form inputs
  const handleChange = (e, section, field, index = null) => {
    const { value } = e.target
    setResumeData((prevData) => {
      if (index !== null) {
        // For experience and other array-based sections
        const updatedExperience = [...prevData.experience]
        updatedExperience[index][field] = value
        return { ...prevData, [section]: updatedExperience }
      }
      return {
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }
    })
  }

  const inputRef = useRef(null) // Reference for the file input

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0] // Get the selected file
    if (file) {
      const reader = new FileReader()

      reader.onloadend = () => {
        // Update the profile with the new image source (base64 encoded)
        setProfile((prevProfile) => ({
          ...prevProfile,
          imageSrc: reader.result, // Store the base64 string of the image
        }))
      }

      // Read the file as a data URL (base64 encoded)
      reader.readAsDataURL(file)
    }
  }

  //  end of original dummy data
  // start of api fetching
  // const [profile, setProfile] = useState({
  //   name: "",
  //   designation: "",
  //   aboutMe: "",
  //   contact: {
  //     phone: "",
  //     email: "",
  //     address: "",
  //   },
  //   skills: {
  //     technical: [],
  //     soft: []
  //   },
  //   experience: [],
  //   projects: [],
  //   personalDetails: {
  //     dob: "",
  //     gender: "",
  //     fatherName: "",
  //     married: "",
  //     passportNumber:"",
  //     validTill: "",
  //     visaStatus: ""
  //   }
  // });

  // // Fetch profile data from API
  // useEffect(() => {
  //   axios.get('https://your-api-endpoint.com/profile')
  //     .then(response => {
  //       setProfile(response.data);  // Set the profile data from the API response
  //     })
  //     .catch(error => {
  //       console.error('Error fetching profile data:', error);
  //     });
  // }, []);

  // const handleChange = (e, field) => {
  //   const { name, value } = e.target;
  //   setProfile(prevProfile => ({
  //     ...prevProfile,
  //     [field]: value,
  //   }));
  // };
// Rajlaxmi jaadale added that code line 371/486
  const profileContainerRef = useRef(null) // Reference to profileContainer
  // Add this after the profileContainerRef declaration
  useEffect(() => {
    if (profileContainerRef.current) {
      profileContainerRef.current = document.querySelector(".resumemainresumecopytempleted")
    }
  }, [stateforToggleResumePreview])
  const formRef = useRef(null) // Reference to form

  const downloadPDF = () => {
    const element = document.querySelector(".resumemainresumecopytempleted")

    if (!element) {
      console.error("Element not found for PDF generation")
      return
    }

    // Hide the form and buttons temporarily
    if (formRef.current) {
      formRef.current.style.display = "none"
    }

    const candidateIdElements = document.querySelectorAll(
      ".candidateidresumecopytemplete, .candidateidcvtemplete-top-close-div",
    )
    candidateIdElements.forEach((el) => {
      el.style.display = "none"
    })

    const buttonDiv = element.querySelector(".buttondivresumecopytemplete")
    if (buttonDiv) {
      buttonDiv.style.display = "none"
    }

    // Options for html2pdf.js
    const options = {
      filename: `${profile.title.name.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Allow external images
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    // Generate the PDF
    html2pdf()
      .from(element)
      .set(options)
      .outputPdf("datauristring")
      .then((pdfData) => {
        // Pass the PDF data to the parent component if the callback exists
        if (typeof onCVDownload === "function") {
          onCVDownload(pdfData)
        }

        // Also save the PDF
        html2pdf().from(element).set(options).save()

        // Restore the elements after PDF generation
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.style.display = "block"
          }

          candidateIdElements.forEach((el) => {
            el.style.display = "block"
          })

          if (buttonDiv) {
            buttonDiv.style.display = "block"
          }
        }, 1000)
      })
  }

  // Handle input change to update the profile
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [section, key] = name.split(".")
      setProfile((prevProfile) => ({
        ...prevProfile,
        [section]: {
          ...prevProfile[section],
          [key]: value,
        },
      }))
    } else if (name.includes("[")) {
      // Handle array fields like experience or projects
      const [section, index, key] = name.match(/([a-zA-Z]+)\[(\d+)\]\.(\w+)/).slice(1)
      setProfile((prevProfile) => {
        const newSection = [...prevProfile[section]]
        newSection[index] = {
          ...newSection[index],
          [key]: value,
        }
        return { ...prevProfile, [section]: newSection }
      })
    } else {
      // Simple field update
      setProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }))
    }
  }
  // rajlaxmi jagadale change classname

  // Replace the existing button in the top div with our new back button
  return (
    <>
      <div className="candidateidcvtemplete-top-close-div">
        {stateforToggleResumePreview ? (
          // Back button when in preview mode
          <button
            onClick={() => {
              setStateforToggleResumePreview(false)
              setStateForReumeToggleForm(true)
            }}
            className="previewresumebuttonforapplicantsform back-button"
          >
            Back
          </button>
        ) : (
          // Preview and Back buttons when in form mode
          <div className="button-container">
            {
              ResumeFromApplicantForm && (
<>
<button
              onClick={() => {
                setStateforToggleResumePreview(true)
                setStateForReumeToggleForm(false)
              }}
              className="previewresumebuttonforapplicantsform"
            >
              Preview
            </button>
            <button
              onClick={handleBack}
              className="previewresumebuttonforapplicantsform back-button"
              style={{ marginLeft: "10px" }}
            >
              Back
            </button>
</>
              )
            }
           
          </div>
        )}
      </div>

      {/* Rest of the component remains the same */}

      <div className="mainflexdivresumecopytemplete">
        {ResumeFromApplicantForm ? (
          stateforToggleResumePreviewForm && (
            <div className="formresumecopytemplete">
              <div className="namecvtemplete-name-div">
                <h2 className="resumeheaderresumecopytemplete">Resume Form</h2>
              </div>

              {/* Personal Details */}
              <h3 className="pdeatilsresumecopytemplete">Personal Details</h3>
              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Name:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="title.name"
                  value={profile.title.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Designation:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="title.designation"
                  value={profile.title.designation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Phone:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="contact.phone"
                  value={profile.contact.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Email:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="email"
                  name="contact.email"
                  value={profile.contact.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Address:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="contact.address"
                  value={profile.contact.address}
                  onChange={handleInputChange}
                />
              </div>

              {/* About Me */}
              <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.aboutMe}</h3>
              <textarea
                className="textareinputresumecopytemplete"
                name="summary.aboutMe"
                value={profile.summary.aboutMe}
                onChange={handleInputChange}
              />

              {/* Skills */}
              <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.skills}</h3>
              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Technical Skills:(comma separated)</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="skills.technical"
                  value={profile.skills.technical.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      skills: {
                        ...profile.skills,
                        technical: e.target.value.split(","),
                      },
                    })
                  }
                />
              </div>

              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Soft Skills:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="skills.soft"
                  value={profile.skills.soft.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      skills: {
                        ...profile.skills,
                        soft: e.target.value.split(","),
                      },
                    })
                  }
                />
              </div>

              {/* Education */}
              <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.education}</h3>
              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">College:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="education.college"
                  value={profile.education.college}
                  onChange={handleInputChange}
                />
              </div>
              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Course:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="education.course"
                  value={profile.education.course}
                  onChange={handleInputChange}
                />
              </div>
              <div className="backdivresumecopytemplete">
                <label className="labelresumecopytemplete">Dates:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name="education.dates"
                  value={profile.education.dates}
                  onChange={handleInputChange}
                />
              </div>

              {/* Experience */}
              <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.experience}</h3>
              {profile.experience.map((exp, index) => (
                <div className="backdivresumecopytemplete" key={index}>
                  <label className="labelresumecopytemplete">Title:</label>
                  <input
                    className="inputboxresumecopytemplete"
                    type="text"
                    name={`experience[${index}].title`}
                    value={exp.title}
                    onChange={handleInputChange}
                  />
                  <label className="labelresumecopytemplete">Company:</label>
                  <input
                    className="inputboxresumecopytemplete"
                    type="text"
                    name={`experience[${index}].company`}
                    value={exp.company}
                    onChange={handleInputChange}
                  />
                  <label className="labelresumecopytemplete">Dates:</label>
                  <input
                    className="inputboxresumecopytemplete"
                    type="text"
                    name={`experience[${index}].dates`}
                    value={exp.dates}
                    onChange={handleInputChange}
                  />
                  <label className="labelresumecopytemplete">Description:</label>
                  <textarea
                    className="textareinputresumecopytemplete"
                    name={`experience[${index}].description`}
                    value={exp.description}
                    onChange={handleInputChange}
                  />
                </div>
              ))}

              {/* Projects */}
              <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.projects}</h3>
              {profile.projects.map((project, index) => (
                <div className="backdivresumecopytemplete" key={index}>
                  <label className="labelresumecopytemplete">Title:</label>
                  <input
                    className="inputboxresumecopytemplete"
                    type="text"
                    name={`projects[${index}].title`}
                    value={project.title}
                    onChange={handleInputChange}
                  />
                  <label className="labelresumecopytemplete">Description:</label>
                  <textarea
                    className="textareinputresumecopytemplete"
                    name={`projects[${index}].description`}
                    value={project.description}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          <>
         
          <div className="formresumecopytemplete">
            <div className="namecvtemplete-name-div">
              <h2 className="resumeheaderresumecopytemplete">Resume Form</h2>
              {/* <button onClick={onClose} className="resume-close-btn">
                {" "}
                &times;
              </button> */}
            </div>

            {/* Personal Details */}
            <h3 className="pdeatilsresumecopytemplete">Personal Details</h3>
            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Name:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="title.name"
                value={profile.title.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Designation:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="title.designation"
                value={profile.title.designation}
                onChange={handleInputChange}
              />
            </div>

            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Phone:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="contact.phone"
                value={profile.contact.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Email:</label>
              <input
                className="inputboxresumecopytemplete"
                type="email"
                name="contact.email"
                value={profile.contact.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Address:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="contact.address"
                value={profile.contact.address}
                onChange={handleInputChange}
              />
            </div>

            {/* About Me */}
            <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.aboutMe}</h3>
            <textarea
              className="textareinputresumecopytemplete"
              name="summary.aboutMe"
              value={profile.summary.aboutMe}
              onChange={handleInputChange}
            />

            {/* Skills */}
            <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.skills}</h3>
            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Technical Skills:(comma separated)</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="skills.technical"
                value={profile.skills.technical.join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    skills: {
                      ...profile.skills,
                      technical: e.target.value.split(","),
                    },
                  })
                }
              />
            </div>

            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Soft Skills:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="skills.soft"
                value={profile.skills.soft.join(", ")}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    skills: {
                      ...profile.skills,
                      soft: e.target.value.split(","),
                    },
                  })
                }
              />
            </div>

            {/* Education */}
            <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.education}</h3>
            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">College:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="education.college"
                value={profile.education.college}
                onChange={handleInputChange}
              />
            </div>
            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Course:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="education.course"
                value={profile.education.course}
                onChange={handleInputChange}
              />
            </div>
            <div className="backdivresumecopytemplete">
              <label className="labelresumecopytemplete">Dates:</label>
              <input
                className="inputboxresumecopytemplete"
                type="text"
                name="education.dates"
                value={profile.education.dates}
                onChange={handleInputChange}
              />
            </div>

            {/* Experience */}
            <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.experience}</h3>
            {profile.experience.map((exp, index) => (
              <div className="backdivresumecopytemplete" key={index}>
                <label className="labelresumecopytemplete">Title:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name={`experience[${index}].title`}
                  value={exp.title}
                  onChange={handleInputChange}
                />
                <label className="labelresumecopytemplete">Company:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name={`experience[${index}].company`}
                  value={exp.company}
                  onChange={handleInputChange}
                />
                <label className="labelresumecopytemplete">Dates:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name={`experience[${index}].dates`}
                  value={exp.dates}
                  onChange={handleInputChange}
                />
                <label className="labelresumecopytemplete">Description:</label>
                <textarea
                  className="textareinputresumecopytemplete"
                  name={`experience[${index}].description`}
                  value={exp.description}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            {/* Projects */}
            <h3 className="pdeatilsresumecopytemplete">{profile.sectionTitles.projects}</h3>
            {profile.projects.map((project, index) => (
              <div className="backdivresumecopytemplete" key={index}>
                <label className="labelresumecopytemplete">Title:</label>
                <input
                  className="inputboxresumecopytemplete"
                  type="text"
                  name={`projects[${index}].title`}
                  value={project.title}
                  onChange={handleInputChange}
                />
                <label className="labelresumecopytemplete">Description:</label>
                <textarea
                  className="textareinputresumecopytemplete"
                  name={`projects[${index}].description`}
                  value={project.description}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>


          <div className="resumemainresumecopytempleted" id="profilecontainerresumecopytemplete">
            {/* Image and Title */}
            <div className="imgandtitleresumecopytemplete">
              <div className="imagemainresumecopytemplete">
                <div className="imageresumecopytemplete" style={{ backgroundImage: `url(${profile.imageSrc})` }}>
                  {/* Edit icon container */}
                  <div className="editmainresumecopytemplete" onClick={() => inputRef.current.click()}>
                    <p>
                      <u>
                        <b className="editwhiteafreen">Edit</b>
                      </u>
                    </p>
                    <img
                      className="imgresumetemplete"
                      src={penPhoto || "/placeholder.svg"}
                      alt="Edit"
                      height={35}
                      width={35}
                    />
                  </div>

                  {/* Hidden file input for image change */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div className="titleresumecopytemplete">
                {/* Make name and designation editable */}
                <p
                  className="fnameresumecopytemplete editable-textresumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "name")}
                >
                  {profile.title.name.split(" ")[0]}
                </p>
                <p
                  className="lnameresumecopytemplete editable-text2resumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "name")}
                >
                  {profile.title.name.split(" ")[1]}
                </p>
                <p
                  className="designationresumecopytemplete editable-text3resumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "designation")}
                >
                  {profile.title.designation}
                </p>
              </div>
            </div>
            {/* Image and Title End */}

            {/* Profile Summary */}
            <div className="flexheroresumecopytemplete">
              <div className="flexbrownresumecopytemplete">
                <div className="textmarginresumecopytemplete">
                  <p
                    className="titlesresumecopytemplete"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "sectionTitles.aboutMe")}
                  >
                    {profile.sectionTitles.aboutMe}
                  </p>
                  <hr className="hrresumecopytemplete" />
                  {/* Make About Me Editable */}
                  <div className="summaryresumecopytemplete">
                    <div
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "aboutMe")}
                      className="profilesummaryresumecopytemplete"
                    >
                      {profile.summary.aboutMe}
                    </div>
                  </div>
                  <div className="contactmainresumecopytemplete">
                    <div className="contactresumecopytemplete">
                      <div>
                        <img src={callImg || "/placeholder.svg"} alt="" height={16} width={16} />
                      </div>
                      <p
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "contact.phone")}
                        className="contactpresumecopytemplete"
                      >
                        {profile.contact.phone}
                      </p>
                    </div>
                    <div className="contactresumecopytemplete">
                      <div>
                        <img src={emailImg || "/placeholder.svg"} alt="" height={16} width={16} />
                      </div>
                      <p
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "contact.email")}
                        className="contactpresumecopytemplete"
                      >
                        {profile.contact.email}
                      </p>
                    </div>
                    <div className="contactresumecopytemplete">
                      <div>
                        <img src={pinImg || "/placeholder.svg"} alt="" height={16} width={16} />
                      </div>
                      <p
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "contact.address")}
                        className="contactpresumecopytemplete"
                      >
                        {profile.contact.address}
                      </p>
                    </div>
                  </div>

                  {/* Profile Summary End */}

                  {/* Education Section */}
                  <div className="educationresumecopytemplete">
                    <p
                      className="titlesresumecopytemplete"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "sectionTitles.skills")}
                    >
                      {profile.sectionTitles.education}
                    </p>
                    <hr className="hrresumecopytemplete" />
                    <div>
                      <p
                        className="collegeresumecopytemplete"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "education.college")}
                      >
                        {profile.education.college}
                      </p>
                    </div>
                    <div className="edulineresumecopytemplete">
                      <div>
                        <p
                          className="courseresumecopytemplete"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, "education.course")}
                        >
                          {profile.education.course}
                        </p>
                      </div>
                      <div>
                        <p
                          className="edudateresumecopytemplete"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, "education.dates")}
                        >
                          {profile.education.dates}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Education Section End */}

                  {/* Skills Section */}
                  <div className="skillingresumecopytemplete">
                    <p
                      className="titlesresumecopytemplete"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "sectionTitles.skills")}
                    >
                      {profile.sectionTitles.skills}
                    </p>
                    <hr className="hrresumecopytemplete" />
                    <div className="skillsmainresumecopytemplete">
                      <div className="skill1resumecopytemplete">
                        <b>
                          <p
                            className="skillsresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "sectionHeadings.technical")}
                          >
                            {profile.sectionHeadings.technical}
                          </p>
                        </b>
                        <ul className="ulresumecopytemplete">
                          {profile.skills.technical.map((skill, index) => (
                            <li
                              className="liresumecopytemplete"
                              key={index}
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, "skills.technical")}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="skill2resumecopytemplete">
                        <b>
                          <p
                            className="skillsresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "sectionHeadings.soft")}
                          >
                            {profile.sectionHeadings.soft}
                          </p>
                        </b>
                        <ul className="ulresumecopytemplete">
                          {profile.skills.soft.map((skill, index) => (
                            <li
                              className="liresumecopytemplete"
                              key={index}
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, "skills.soft")}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Skills Section End */}
                </div>
              </div>

              {/* Experience Section */}
              <div className="flexwhiteresumecopytemplete">
                <p
                  className="titlesresumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "sectionTitles.experience")}
                >
                  {profile.sectionTitles.experience}
                </p>
                <hr className="hrresumecopytemplete" />
                {profile.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="expflexresumecopytemplete">
                      <div className="companyresumecopytemplete">
                        <b>
                          <p
                            className="exptitleresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "experience.title")}
                          >
                            {exp.title}
                          </p>
                        </b>
                        <b>
                          <p
                            className="expcompanyresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "experience.company")}
                          >
                            <b>{exp.company}</b>
                          </p>
                        </b>
                      </div>
                      <div className="expdatedivresumecopytemplete">
                        <b>
                          <p
                            className="expdateresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "experience.dates")}
                          >
                            {exp.dates}
                          </p>
                        </b>
                      </div>
                    </div>
                    <p
                      className="expdesresumecopytemplete"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "experience.description")}
                    >
                      {exp.description}
                    </p>
                  </div>
                ))}
                {/* exp end */}
                {/* project start */}
                {/* Projects Section */}
                <div className="projects-sectionresumecopytemplete">
                  <p
                    className="titlesresumecopytemplete"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "sectionTitles.projects")}
                  >
                    {profile.sectionTitles.projects}
                  </p>
                  <hr className="hrresumecopytemplete" />
                  {profile.projects.map((project, index) => (
                    <div key={index}>
                      <div>
                        <b>
                          <p
                            className="exptitleresumecopytemplete projresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `projects[${index}].title`)}
                          >
                            {project.title}
                          </p>
                        </b>
                      </div>
                      <div>
                        <p
                          className="expdesresumecopytemplete"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `projects[${index}].description`)}
                        >
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Projects Section End */}
                {/* project end */}
                {/* personal details */}
                <p
                  className="titlesresumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "sectionTitles.personalDetails")}
                >
                  {profile.sectionTitles.personalDetails}
                </p>
                <hr className="hrresumecopytemplete" />
                <div className="personaldeetsflexresumecopytemplete">
                  <div className="perflex1resumecopytemplete">
                    {/* Date of Birth */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.dobTitle")}
                          >
                            Date of Birth:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.dob")}
                        >
                          {profile.personalDetails.dob}
                        </p>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.genderTitle")}
                          >
                            Gender:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.gender")}
                        >
                          {profile.personalDetails.gender}
                        </p>
                      </div>
                    </div>

                    {/* Father's Name */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.fatherNameTitle")}
                          >
                            Father's Name:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.fatherName")}
                        >
                          {profile.personalDetails.fatherName}
                        </p>
                      </div>
                    </div>

                    {/* Married Status */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.marriedTitle")}
                          >
                            Married:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.married")}
                        >
                          {profile.personalDetails.married}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="perflex2resumecopytemplete">
                    {/* Passport Number */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.passportNumberTitle")}
                          >
                            Passport Number:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.passportNumber")}
                        >
                          {profile.personalDetails.passportNumber}
                        </p>
                      </div>
                    </div>

                    {/* Valid Till */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.validTillTitle")}
                          >
                            Valid Till:
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.validTill")}
                        >
                          {profile.personalDetails.validTill}
                        </p>
                      </div>
                    </div>

                    {/* Visa Status */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.visaStatusTitle")}
                          >
                            Visa Status:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.visaStatus")}
                        >
                          {profile.personalDetails.visaStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Rajlaxmi jagadale added taht code */}
            <div className="buttondivresumecopytemplete">
              <button onClick={downloadPDF} className="buttonresumecopytemplete downloadbuttonresume ">
                Download PDF
              </button>
              {
                ResumeFromApplicantForm && (
                  <button onClick={handleSetCV} className="buttonresumecopytemplete">
                  Set Resume
                </button>
                )
              }
             
            </div>
          </div>

          </>
        )}

        {/* Resume Preview Section */}
        {stateforToggleResumePreview && (
          <div className="resumemainresumecopytempleted" id="profilecontainerresumecopytemplete">
            {/* Image and Title */}
            <div className="imgandtitleresumecopytemplete">
              <div className="imagemainresumecopytemplete">
                <div className="imageresumecopytemplete" style={{ backgroundImage: `url(${profile.imageSrc})` }}>
                  {/* Edit icon container */}
                  <div className="editmainresumecopytemplete" onClick={() => inputRef.current.click()}>
                    <p>
                      <u>
                        <b className="editwhiteafreen">Edit</b>
                      </u>
                    </p>
                    <img
                      className="imgresumetemplete"
                      src={penPhoto || "/placeholder.svg"}
                      alt="Edit"
                      height={35}
                      width={35}
                    />
                  </div>

                  {/* Hidden file input for image change */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={inputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
              <div className="titleresumecopytemplete">
                {/* Make name and designation editable */}
                <p
                  className="fnameresumecopytemplete editable-textresumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "name")}
                >
                  {profile.title.name.split(" ")[0]}
                </p>
                <p
                  className="lnameresumecopytemplete editable-text2resumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "name")}
                >
                  {profile.title.name.split(" ")[1]}
                </p>
                <p
                  className="designationresumecopytemplete editable-text3resumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "designation")}
                >
                  {profile.title.designation}
                </p>
              </div>
            </div>
            {/* Image and Title End */}

            {/* Profile Summary */}
            <div className="flexheroresumecopytemplete">
              <div className="flexbrownresumecopytemplete">
                <div className="textmarginresumecopytemplete">
                  <p
                    className="titlesresumecopytemplete"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "sectionTitles.aboutMe")}
                  >
                    {profile.sectionTitles.aboutMe}
                  </p>
                  <hr className="hrresumecopytemplete" />
                  {/* Make About Me Editable */}
                  <div className="summaryresumecopytemplete">
                    <div
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "aboutMe")}
                      className="profilesummaryresumecopytemplete"
                    >
                      {profile.summary.aboutMe}
                    </div>
                  </div>
                  <div className="contactmainresumecopytemplete">
                    <div className="contactresumecopytemplete">
                      <div>
                        <img src={callImg || "/placeholder.svg"} alt="" height={16} width={16} />
                      </div>
                      <p
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "contact.phone")}
                        className="contactpresumecopytemplete"
                      >
                        {profile.contact.phone}
                      </p>
                    </div>
                    <div className="contactresumecopytemplete">
                      <div>
                        <img src={emailImg || "/placeholder.svg"} alt="" height={16} width={16} />
                      </div>
                      <p
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "contact.email")}
                        className="contactpresumecopytemplete"
                      >
                        {profile.contact.email}
                      </p>
                    </div>
                    <div className="contactresumecopytemplete">
                      <div>
                        <img src={pinImg || "/placeholder.svg"} alt="" height={16} width={16} />
                      </div>
                      <p
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "contact.address")}
                        className="contactpresumecopytemplete"
                      >
                        {profile.contact.address}
                      </p>
                    </div>
                  </div>

                  {/* Profile Summary End */}

                  {/* Education Section */}
                  <div className="educationresumecopytemplete">
                    <p
                      className="titlesresumecopytemplete"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "sectionTitles.skills")}
                    >
                      {profile.sectionTitles.education}
                    </p>
                    <hr className="hrresumecopytemplete" />
                    <div>
                      <p
                        className="collegeresumecopytemplete"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "education.college")}
                      >
                        {profile.education.college}
                      </p>
                    </div>
                    <div className="edulineresumecopytemplete">
                      <div>
                        <p
                          className="courseresumecopytemplete"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, "education.course")}
                        >
                          {profile.education.course}
                        </p>
                      </div>
                      <div>
                        <p
                          className="edudateresumecopytemplete"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, "education.dates")}
                        >
                          {profile.education.dates}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Education Section End */}

                  {/* Skills Section */}
                  <div className="skillingresumecopytemplete">
                    <p
                      className="titlesresumecopytemplete"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "sectionTitles.skills")}
                    >
                      {profile.sectionTitles.skills}
                    </p>
                    <hr className="hrresumecopytemplete" />
                    <div className="skillsmainresumecopytemplete">
                      <div className="skill1resumecopytemplete">
                        <b>
                          <p
                            className="skillsresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "sectionHeadings.technical")}
                          >
                            {profile.sectionHeadings.technical}
                          </p>
                        </b>
                        <ul className="ulresumecopytemplete">
                          {profile.skills.technical.map((skill, index) => (
                            <li
                              className="liresumecopytemplete"
                              key={index}
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, "skills.technical")}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="skill2resumecopytemplete">
                        <b>
                          <p
                            className="skillsresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "sectionHeadings.soft")}
                          >
                            {profile.sectionHeadings.soft}
                          </p>
                        </b>
                        <ul className="ulresumecopytemplete">
                          {profile.skills.soft.map((skill, index) => (
                            <li
                              className="liresumecopytemplete"
                              key={index}
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, "skills.soft")}
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* Skills Section End */}
                </div>
              </div>

              {/* Experience Section */}
              <div className="flexwhiteresumecopytemplete">
                <p
                  className="titlesresumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "sectionTitles.experience")}
                >
                  {profile.sectionTitles.experience}
                </p>
                <hr className="hrresumecopytemplete" />
                {profile.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="expflexresumecopytemplete">
                      <div className="companyresumecopytemplete">
                        <b>
                          <p
                            className="exptitleresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "experience.title")}
                          >
                            {exp.title}
                          </p>
                        </b>
                        <b>
                          <p
                            className="expcompanyresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "experience.company")}
                          >
                            <b>{exp.company}</b>
                          </p>
                        </b>
                      </div>
                      <div className="expdatedivresumecopytemplete">
                        <b>
                          <p
                            className="expdateresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, "experience.dates")}
                          >
                            {exp.dates}
                          </p>
                        </b>
                      </div>
                    </div>
                    <p
                      className="expdesresumecopytemplete"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "experience.description")}
                    >
                      {exp.description}
                    </p>
                  </div>
                ))}
                {/* exp end */}
                {/* project start */}
                {/* Projects Section */}
                <div className="projects-sectionresumecopytemplete">
                  <p
                    className="titlesresumecopytemplete"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "sectionTitles.projects")}
                  >
                    {profile.sectionTitles.projects}
                  </p>
                  <hr className="hrresumecopytemplete" />
                  {profile.projects.map((project, index) => (
                    <div key={index}>
                      <div>
                        <b>
                          <p
                            className="exptitleresumecopytemplete projresumecopytemplete"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `projects[${index}].title`)}
                          >
                            {project.title}
                          </p>
                        </b>
                      </div>
                      <div>
                        <p
                          className="expdesresumecopytemplete"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `projects[${index}].description`)}
                        >
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Projects Section End */}
                {/* project end */}
                {/* personal details */}
                <p
                  className="titlesresumecopytemplete"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "sectionTitles.personalDetails")}
                >
                  {profile.sectionTitles.personalDetails}
                </p>
                <hr className="hrresumecopytemplete" />
                <div className="personaldeetsflexresumecopytemplete">
                  <div className="perflex1resumecopytemplete">
                    {/* Date of Birth */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.dobTitle")}
                          >
                            Date of Birth:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.dob")}
                        >
                          {profile.personalDetails.dob}
                        </p>
                      </div>
                    </div>

                    {/* Gender */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.genderTitle")}
                          >
                            Gender:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.gender")}
                        >
                          {profile.personalDetails.gender}
                        </p>
                      </div>
                    </div>

                    {/* Father's Name */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.fatherNameTitle")}
                          >
                            Father's Name:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.fatherName")}
                        >
                          {profile.personalDetails.fatherName}
                        </p>
                      </div>
                    </div>

                    {/* Married Status */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.marriedTitle")}
                          >
                            Married:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.married")}
                        >
                          {profile.personalDetails.married}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="perflex2resumecopytemplete">
                    {/* Passport Number */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.passportNumberTitle")}
                          >
                            Passport Number:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.passportNumber")}
                        >
                          {profile.personalDetails.passportNumber}
                        </p>
                      </div>
                    </div>

                    {/* Valid Till */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.validTillTitle")}
                          >
                            Valid Till:
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.validTill")}
                        >
                          {profile.personalDetails.validTill}
                        </p>
                      </div>
                    </div>

                    {/* Visa Status */}
                    <div className="personalresumecopytemplete">
                      <div className="personaltitleresumecopytemplete">
                        <b>
                          <p
                            className="pertitleresumecopytemplete"
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            onBlur={(e) => handleChange(e, "personalDetails.visaStatusTitle")}
                          >
                            Visa Status:{" "}
                          </p>
                        </b>
                      </div>
                      <div className="per1resumecopytemplete">
                        <p
                          contentEditable={true}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handleChange(e, "personalDetails.visaStatus")}
                        >
                          {profile.personalDetails.visaStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Rajlaxmi jagadale added taht code */}
            <div className="buttondivresumecopytemplete">
              <button onClick={downloadPDF} className="buttonresumecopytemplete downloadbuttonresume ">
                Download PDF
              </button>
              <button onClick={handleSetCV} className="buttonresumecopytemplete">
                Set Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ResumeCopy;
