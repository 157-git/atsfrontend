import React, { useState, useRef } from "react";
import "./cv.css";
import html2pdf from "html2pdf.js"
// import { jsPDF } from "jspdf";
// import html2pdf from 'html2pdf.js';
// import FormEdit from "./FormEdit";
// import Main from "./Resume";
// import Resume from './Resume';

// Name: Afreen Sanaulla
// Title: CV
// Description : Completely edidatable cv with inputs and option od pdf download
// Lines: 1213
function CvTemplate({ cvFromApplicantForm, onClose, onCVDownload, onSetCV, onBack }) {
  const [isEditing, setIsEditing] = useState(false) // This is necessary for toggling between view/edit
  //   const [stateForCvFromApplicantsForm, setStateForCvFromApplicantsForm] = useState(cvFromApplicantForm ? cvFromApplicantForm : null)
  // const [stateforToggleResumePreview, setStateForReumeToggle] = useState(false)
  const [stateforToggleResumePreviewForm, setStateForReumeToggleForm] = useState(true)
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
  const [stateforToggleResumePreview, setStateforToggleResumePreview] = useState(false)
// Rajlaxmi jagadale added that code
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
  const [profile, setProfile] = useState({
    sectionTitles: {
      aboutMe: "Professional Summary",
      skills: "Core Competencies",
      education: "Education",
      experience: "Professional Experience",
      certifications: "Projects",
      certification: "Certifications",
      personalDetails: "Personal Details",
    },
    summary: cvFromApplicantForm
      ? ""
      : {
          aboutMe:
            "Highly experienced Business Consultant with over 10 years of expertise in leading teams, strategic consulting, and driving business transformations. Proven ability to develop innovative solutions and deliver measurable results across diverse industries.",
        },
    title: cvFromApplicantForm
      ? { name: "", designation: "" }
      : {
          name: "Olivia Schumacher",
          designation: "Senior Business Consultant",
        },
    contact: {
      phone: cvFromApplicantForm ? "" : "9876543210",
      email: cvFromApplicantForm ? "" : "olivia.schumacher@email.com",
      address: cvFromApplicantForm ? "" : "Pune, Maharashtra, India",
    },
    skills: {
      technical: cvFromApplicantForm
        ? []
        : ["Business Strategy", "Team Leadership", "Financial Planning", "Data Analytics", "Change Management"],
      soft: cvFromApplicantForm
        ? []
        : ["Leadership", "Problem-Solving", "Client Relations", "Communication", "Negotiation"],
    },
    experience: [
      {
        title: cvFromApplicantForm ? "" : "Senior Business Consultant ",
        company: cvFromApplicantForm ? "" : " TechCorp Pvt Ltd",
        dates: cvFromApplicantForm ? "" : "2018 - Present",
        description: cvFromApplicantForm
          ? []
          : [
              "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
              "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
              "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
              "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
              "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
              "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
            ],
      },
      // {
      //   title: "Business Consultant ",
      //   company: " Innovate Solutions",
      //   dates: "2015 - 2018",
      //   description:cvFromApplicantForm ? []  : [
      //     "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
      //     "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
      //     "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
      //     "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
      //     "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
      //     "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
      //   ],
      // },
      // {
      //   title: "Senior Business Consultant ",
      //   company: " TechCorp Pvt Ltd",
      //   dates: " 2012 - 2013",
      //   description:cvFromApplicantForm ? []  : [
      //     "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
      //     "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
      //     "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
      //     "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
      //     "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
      //     "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
      //   ],
      // },
      // {
      //   title: "Senior Business Consultant ",
      //   company: " TechCorp Pvt Ltd",
      //   dates: " 2012 - 2013",
      //   description:cvFromApplicantForm ? []  : [
      //     "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
      //     "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
      //     "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
      //     "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
      //     "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
      //     "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
      //   ],
      // },
      // {
      //   title: "Senior Business Consultant ",
      //   company: " TechCorp Pvt Ltd",
      //   dates: " 2012 - 2013",
      //   description: cvFromApplicantForm ? []  :[
      //     "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
      //     "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
      //     "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
      //     "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
      //     "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
      //     "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
      //   ],
      // },
      // {
      //   title: "Senior Business Consultant ",
      //   company: " TechCorp Pvt Ltd",
      //   dates: " 2012 - 2013",
      //   description:cvFromApplicantForm ? []  : [
      //     "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
      //     "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
      //     "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
      //     "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
      //     "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
      //     "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
      //   ],
      // },
    ],
    education: [
      {
        college: cvFromApplicantForm ? "" : "Arihant Business School",
        course: cvFromApplicantForm ? "" : "Master of Business Administration ",
        dates: cvFromApplicantForm ? "" : "2013 - 2015",
      },
      // {
      //   college: "Ness Wadia",
      //   course: "Bachelor of Business Administration ",
      //   dates: "2013 - 2015",
      // },
      // {
      //   college: "Vatsalya School",
      //   course: "High School",
      //   dates: "2013 - 2015",
      // },
      // {
      //   college: "Vatsalya School",
      //   course: "High School",
      //   dates: "2013 - 2015",
      // },
    ],
    certifications: [
      {
        title: cvFromApplicantForm ? "" : "Digital Transformation for Global Bank",
        dates: cvFromApplicantForm ? "" : "2020 - 2021",
        description: cvFromApplicantForm
          ? []
          : [
              "Managed a team of 10 consultants to execute a multi-phase digital transformation project for a leading global bank.",
              "Implemented AI-driven financial tools and automated business processes, reducing manual effort by 40% and improving customer satisfaction by 30%.",
              "Led workshops to train staff and executives on the new technologies, ensuring seamless adoption of new systems across departments.",
              "Resulted in the client reducing operational costs by $5M annually and improving overall customer retention by 25%.",
            ],
      },
      // {
      //   title: "Enterprise Resource Planning (ERP) Implementation for Retail Giant",
      //   dates: "2019",
      //   description: [
      //     "Led a 12-month ERP implementation project for a multinational retail company, optimizing business functions including inventory management, HR, and accounting.",
      //     "Integrated legacy systems with new software, improving data accuracy and operational efficiency across the organization.",
      //     "Project reduced inventory-related issues by 50%, streamlined payroll processing, and provided real-time insights into key business metrics.",
      //     "Successfully trained 300+ employees on the new system, ensuring a smooth transition with minimal disruptions.",
      //   ],
      // },
      // {
      //   title: "Supply Chain Optimization for Manufacturing Client",
      //   dates: "2018",
      //   description: [
      //     "Spearheaded the redesign of the supply chain strategy for a global manufacturing client, focusing on optimizing sourcing, inventory management, and logistics.",
      //     "Leveraged data analytics and machine learning models to predict supply chain disruptions and optimize product delivery.",
      //     "Project reduced supply chain delays by 35% and saved the client $3M annually in logistics and inventory costs.",
      //     "Collaborated with the client's IT department to integrate IoT technology for real-time tracking and better decision-making.",
      //   ],
      // },
    ],
    certification: [
      {
        title: cvFromApplicantForm ? "" : "AWS Certified Solutions Architect – Associate",
        date: cvFromApplicantForm ? "" : "2021",
        description: cvFromApplicantForm
          ? []
          : [
              "Proficient in designing and deploying scalable and highly available systems on AWS.",
              "Experienced with AWS services such as EC2, S3, RDS, Lambda, and CloudFormation.",
              "Ability to design cost-effective, fault-tolerant, and scalable cloud architectures.",
              "Skills in security, networking, and operational best practices for AWS environments.",
            ],
      },
      // {
      //   title: "Certified Scrum Master (CSM)",
      //   date: " 2019",
      //   description: [
      //     "Certified Scrum Master with in-depth knowledge of Scrum principles and Agile methodologies.",
      //     "Successfully facilitated Scrum ceremonies such as daily stand-ups, sprint planning, and retrospectives.",
      //     "Led teams in a collaborative, transparent environment, focusing on delivering high-quality software products.",
      //     "Guided and coached teams and product owners to adhere to Scrum practices and improve team performance.",
      //   ],
      // },
      // {
      //   title: "Certified Information Systems Security Professional (CISSP)",
      //   date: " 2019",
      //   description: [
      //     "Advanced expertise in designing, implementing, and managing cybersecurity programs.",
      //     "Skilled in risk management, asset security, and security engineering across IT systems.",
      //     "Experience conducting security audits, threat modeling, and penetration testing.",
      //     "In-depth knowledge of industry standards and regulations such as GDPR, HIPAA, and NIST.",
      //   ],
      // },
      // {
      //   title: "Project Management Professional (PMP)",
      //   date: " 2019",
      //   description: [
      //     "Certified PMP with expertise in managing complex, multi-phase projects across diverse industries.",
      //     "Strong ability to define project scope, manage stakeholders, and oversee project delivery on time and within budget.",
      //     "Proficient in risk management, resource allocation, and strategic project planning.",
      //     "Successfully led projects with cross-functional teams, meeting both scope and financial goals.",
      //   ],
      // },
      // {
      //   title: "Certified Scrum Master (CSM)",
      //   date: " 2019",
      //   description: [
      //     "Certified Scrum Master with expertise in Agile project management.",
      //     "Facilitated Scrum ceremonies and assisted teams in achieving their Sprint goals.",
      //     "Promoted Agile best practices, ensuring timely delivery of projects and increased collaboration.",
      //     "Provided coaching to teams and stakeholders on Agile principles and frameworks.",
      //   ],
      // },
      // {
      //   title: "Google Cloud Professional Cloud Architect",
      //   date: " 2019",
      //   description: [
      //     "Specialized in designing, deploying, and managing solutions on Google Cloud Platform (GCP).",
      //     "Experienced in designing infrastructure for compute, networking, storage, and big data solutions on GCP.",
      //     "Led cloud migration and optimization projects, reducing infrastructure costs while increasing performance.",
      //     "Proficient in Kubernetes, machine learning tools, and building scalable architectures on GCP.",
      //   ],
      // },
    ],
    personalDetails: {
      dob: cvFromApplicantForm ? "" : "1/2/1985",
      gender: cvFromApplicantForm ? "" : "Female",
      maritalStatus: cvFromApplicantForm ? "" : "Single",
      nationality: cvFromApplicantForm ? "" : "Indian",
    },
  })
// Rajlaxmi JAadale Added that code line 288/535
  const handleSetCV = () => {
    const element = document.querySelector(".maincvtemeplete")

    if (!element) {
      console.error("Element not found for PDF generation")
      return
    }

    // Temporarily hide unwanted elements
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

    // ✅ Inline styles to ensure full capture
    element.style.width = "210mm" // A4 width
    element.style.minHeight = "297mm" // A4 height
    element.style.padding = "10mm"
    element.style.boxSizing = "border-box"
    element.style.overflow = "visible" // Ensure full scrollable height is captured

    // PDF generation options
    const options = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `${profile.title.name.replace(/\s+/g, "_")}_Resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
      },
    }

    html2pdf()
      .from(element)
      .set(options)
      .outputPdf("datauristring")
      .then((pdfData) => {
        if (typeof onSetCV === "function") {
          onSetCV(pdfData)
        }

        // Restore hidden elements after generation
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

          // Reset inline styles if needed
          // ✅ Inline styles to ensure full capture and proper margin
          element.style.width = "210mm" // A4 width
          element.style.minHeight = "297mm" // A4 height
          element.style.padding = "20mm 10mm 10mm 10mm" // top right bottom left
          element.style.boxSizing = "border-box"
          element.style.overflow = "visible" // Ensure full scrollable height is captured
        }, 1000)
      })
  }

  const formRef = useRef(null) // Reference to form
  const downloadPDF = () => {
    const element = document.querySelector(".maincvtemeplete")

    if (!element) {
      console.error("Element not found for PDF generation")
      return
    }

    // Hide elements before capture
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

    // Scroll to top
    window.scrollTo(0, 0)

    // Delay to apply changes before rendering
    setTimeout(() => {
      const options = {
        margin: [10, 10, 10, 10], // top, left, bottom, right
        filename: `${profile.title.name.replace(/\s+/g, "_")}_Resume.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".page-break", // Optional: add manual page breaks
        },
      }

      html2pdf()
        .set(options)
        .from(element)
        .outputPdf("blob")
        .then((pdfBlob) => {
          // Save the PDF
          const pdfUrl = URL.createObjectURL(pdfBlob)

          // Create a download link
          const downloadLink = document.createElement("a")
          downloadLink.href = pdfUrl
          downloadLink.download = `${profile.title.name.replace(/\s+/g, "_")}_Resume.pdf`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)

          // If onCVDownload is provided, call it with the PDF blob
          if (typeof onCVDownload === "function") {
            onCVDownload(pdfBlob)
          }

          // Restore hidden elements
          if (formRef.current) {
            formRef.current.style.display = "block"
          }
          candidateIdElements.forEach((el) => {
            el.style.display = "block"
          })
          if (buttonDiv) {
            buttonDiv.style.display = "block"
          }
        })
    }, 500)
  }

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    // Get the content to print
    const contentToPrint = document.querySelector(".maincvtemeplete").cloneNode(true)

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
            .maincvtemeplete {
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
  const handleChange = (e, field, section, index = null) => {
    const value = e.target.value
    console.log("Updating field:", field, "in section:", section, "at index:", index, "with value:", value)

    setProfile((prevProfile) => {
      const updatedProfile = { ...prevProfile }

      console.log("Previous profile state:", prevProfile)

      if (!updatedProfile[section]) {
        console.warn(`Section "${section}" is not defined, initializing...`)
        updatedProfile[section] = Array.isArray(value) ? [] : {} // Initialize section if not present
      }

      if (index !== null) {
        if (!updatedProfile[section][index]) {
          console.warn(`Index "${index}" does not exist in section "${section}", initializing...`)
          updatedProfile[section][index] = {} // Initialize item if it doesn't exist at the index
        }

        // Handle description fields specially to ensure they're always arrays
        if (field === "description" && typeof value === "string") {
          updatedProfile[section][index][field] = value.split("\n").filter((item) => item.trim() !== "")
        } else {
          updatedProfile[section][index][field] = value
        }
      } else if (section === "skills") {
        updatedProfile[section][field] = value.split(",").map((item) => item.trim())
      } else {
        updatedProfile[section][field] = value
      }

      console.log("Updated profile state:", updatedProfile)

      return updatedProfile
    })
  }

  //   const handleChange = (e, field, section, index = null) => {
  //     const value = e.target.value;
  //     console.log(
  //       "Updating field:",
  //       field,
  //       "in section:",
  //       section,
  //       "at index:",
  //       index,
  //       "with value:",
  //       value
  //     );

  //     setProfile((prevProfile) => {
  //       const updatedProfile = { ...prevProfile };

  //       console.log("Previous profile state:", prevProfile);

  //       if (!updatedProfile[section]) {
  //         console.warn(`Section "${section}" is not defined, initializing...`);
  //         updatedProfile[section] = Array.isArray(value) ? [] : {}; // Initialize section if not present
  //       }

  //       if (index !== null) {
  //         if (!updatedProfile[section][index]) {
  //           console.warn(
  //             `Index "${index}" does not exist in section "${section}", initializing...`
  //           );
  //           updatedProfile[section][index] = {}; // Initialize item if it doesn't exist at the index
  //         }

  //         updatedProfile[section][index][field] = value;
  //       } else if (section === "skills") {
  //         updatedProfile[section][field] = value
  //           .split(",")
  //           .map((item) => item.trim());
  //       } else {
  //         updatedProfile[section][field] = value;
  //       }

  //       console.log("Updated profile state:", updatedProfile);

  //       return updatedProfile;
  //     });
  //   };

  // Handle adding a new experience entry
  const addExperience = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      experience: [
        ...prevProfile.experience,
        {
          title: "",
          company: "",
          dates: "",
          description: [""], // adding a new empty description array for each new entry
        },
      ],
    }))
  }

  // Handle removing an experience entry
  const removeExperience = (index) => {
    setProfile((prevProfile) => {
      const updatedExperience = prevProfile.experience.filter((_, idx) => idx !== index)
      return { ...prevProfile, experience: updatedExperience }
    })
  }

  // Handle adding a new certification entry
  const addCertification = () => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      certifications: [
        ...prevProfile.certifications,
        {
          title: "",
          dates: "",
          description: [""], // adding a new empty description array for each new entry
        },
      ],
    }))
  }

  // Handle removing a certification entry
  const removeCertification = (index) => {
    setProfile((prevProfile) => {
      const updatedCertifications = prevProfile.certifications.filter((_, idx) => idx !== index)
      return { ...prevProfile, certifications: updatedCertifications }
    })
  }
  // Rajlaxmi Jagadale rename all classname
  return (
    <>
      {/* <div className="candidateidcvtemplete">
        <input
          className="InputFieldsearchcvtemplete"
          type="text"
          placeholder="Enter Canddidate ID"
        />
        <button className="candidatesearchbuttoncvtemplete">
          Search Candidate
        </button>
        <button onClick={onClose} className="resume-close-btn">  &times;</button>
      </div> */}
     {/* <div className="candidateidcvtemplete-top-close-div">
  <button
    onClick={() => {
      setStateForReumeToggle(!stateforToggleResumePreview);
      setStateForReumeToggleForm(!stateforToggleResumePreviewForm);
    }}
    className={`previewresumebuttonforapplicantsform ${stateforToggleResumePreview ? "back-button" : ""}`}
  >
    {stateforToggleResumePreview ? "Back" : "Preview"}
  </button>


</div> */}
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
// Rajalxmi jaadale some chane of taht code for back button   
       <div className="button-container">
        {
          cvFromApplicantForm && (
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

      {/* <div className="mainflex
            >
              Back
            </button>
          </div>
        )}
      </div> */}

      <div className="mainflexdivcvtemplete">
        {/* form staart */}
        {cvFromApplicantForm ? (
          stateforToggleResumePreviewForm && (
            <div className="formeditcvtemplete"e="formeditcvtemplete" ref={formRef}>
              <div className="containercvtemplete">
                {/* <h2 className='resume_editor'>Resume Editor</h2> */}

                {/* Form Section */}
                <div className="form-sectioncvtemplete">
                  {/* <h2 className="resume_editorcvtemplete">Resume</h2> */}
                  <form>
                    {/* Personal Details */}
                    <div className="form-groupcvtemplete">
                      <p className="titlescvtemplete headingtitlescvtemplete">
                        {profile.sectionTitles.personalDetails}
                      </p>
                      <hr className="hrformgroupcvtemplete" />
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Full Name:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={profile.title.name}
                        onChange={(e) => handleChange(e, "name", "title")}
                      />
                    </div>

                    <div className="form-groupcvtemplete">
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Designation:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={profile.title.designation}
                        onChange={(e) => handleChange(e, "designation", "title")}
                      />
                    </div>

                    <div className="form-groupcvtemplete">
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Phone:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="tel"
                        value={profile.contact.phone}
                        onChange={(e) => handleChange(e, "phone", "contact")}
                      />
                    </div>

                    <div className="form-groupcvtemplete">
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Email:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="email"
                        value={profile.contact.email}
                        onChange={(e) => handleChange(e, "email", "contact")}
                      />
                    </div>

                    <div className="form-groupcvtemplete">
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Address:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={profile.contact.address}
                        onChange={(e) => handleChange(e, "address", "contact")}
                      />
                    </div>

                    {/* Professional Summary (About Me) */}
                    <div className="form-groupcvtemplete">
                      <p className="titlescvtemplete">{profile.sectionTitles.aboutMe}</p>
                      <hr className="hrformgroupcvtemplete" />
                      <textarea
                        className="formgrouptextarea"
                        value={profile.summary.aboutMe}
                        onChange={(e) => handleChange(e, "aboutMe", "summary")}
                      />
                    </div>

                    {/* Skills */}
                    <div className="form-groupcvtemplete">
                      <p className="titlescvtemplete">{profile.sectionTitles.skills}</p>
                      <hr className="hrformgroupcvtemplete" />
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">
                        Technical Skills (comma separated):
                      </label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={profile.skills.technical.join(", ")}
                        onChange={(e) => handleChange(e, "technical", "skills")}
                      />
                    </div>

                    <div className="form-groupcvtemplete">
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">
                        Soft Skills (comma separated):
                      </label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={profile.skills.soft.join(", ")}
                        onChange={(e) => handleChange(e, "soft", "skills")}
                      />
                    </div>

                    {/* Experience */}
                    <div className="formexperience">
                      <p className="titlescvtemplete">{profile.sectionTitles.experience}</p>
                      <hr className="hrformgroupcvtemplete" />
                      {/* Loop through each experience entry */}
                      {profile.experience.map((exp, index) => (
                        <div key={index}>
                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Job Title:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={exp.title}
                              onChange={(e) => handleChange(e, "title", "experience", index)}
                            />
                          </div>

                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Company:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleChange(e, "company", "experience", index)}
                            />
                          </div>

                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={exp.dates}
                              onChange={(e) => handleChange(e, "dates", "experience", index)}
                            />
                          </div>

                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Description:</label>
                            <textarea
                              className="formgrouptextarea"
                              value={Array.isArray(exp.description) ? exp.description.join("\n") : ""}
                              onChange={(e) => handleChange(e, "description", "experience", index)}
                            />
                          </div>

                          {/* Remove Experience Button - only show when there's more than one experience */}
                          {profile.experience.length > 1 && (
                            <button className="Forminsidebuttons" type="button" onClick={() => removeExperience(index)}>
                              Remove Experience
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Add Experience Button */}
                      <button className="Forminsidebuttons" type="button" onClick={addExperience}>
                        Add Experience
                      </button>
                    </div>

                    {/* Education */}
                    <div className="form-groupcvtemplete">
                      <p className="titlescvtemplete">{profile.sectionTitles.education}</p>
                      <hr className="hrformgroupcvtemplete" />
                      {profile.education.map((edu, index) => (
                        <div key={index}>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">College/School:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={edu.college}
                            onChange={(e) => handleChange(e, "college", "education", index)}
                          />

                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Course:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={edu.course}
                            onChange={(e) => handleChange(e, "course", "education", index)}
                          />

                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={edu.dates}
                            onChange={(e) => handleChange(e, "dates", "education", index)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="certificationscvtemplete">
                      {/* Editable Section Title for Certifications */}
                      <p
                        className="titlescvtemplete editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "certifications", "sectionTitles")}
                      >
                        {profile.sectionTitles.certifications}
                      </p>
                      <hr className="hrformgroupcvtemplete" />

                      {/* Loop through each certification entry */}
                      {profile.certifications.map((certification, index) => (
                        <div key={index} className="experience-itemcvtemplete">
                          {/* Editable Certification Title and Dates */}
                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Title:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={certification.title}
                              onChange={(e) => handleChange(e, "title", "certifications", index)}
                            />
                          </div>

                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={certification.dates}
                              onChange={(e) => handleChange(e, "dates", "certifications", index)}
                            />
                          </div>

                          {/* Editable Description List */}
                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Description:</label>
                            <textarea
                              className="formgrouptextarea"
                              value={Array.isArray(certification.description) ? certification.description.join("\n") : ""}
                              onChange={(e) => {
                                const updatedValue = e.target.value;
                                const descriptionArray = updatedValue.split("\n").filter(item => item.trim() !== "");
                                const updatedCertifications = [...profile.certifications];
                                updatedCertifications[index].description = descriptionArray;
                                setProfile({
                                  ...profile,
                                  certifications: updatedCertifications,
                                });
                              }}
                            />
                          </div>

                          {/* Add Description Button */}
                          <button
                            className="Forminsidebuttons"
                            type="button"
                            onClick={() => {
                              const updatedCertifications = [...profile.certifications]
                              updatedCertifications[index].description.push("") // Add empty description field
                              setProfile({
                                ...profile,
                                certifications: updatedCertifications,
                              })
                            }}
                          >
                            Add Description
                          </button>
                          <div>
                            {/* Remove Certification Button */}
                            <button
                              className="Forminsidebuttons"
                              type="button"
                              onClick={() => removeCertification(index)}
                            >
                              Remove Certification
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Certification Button */}
                      <button className="Forminsidebuttons" type="button" onClick={addCertification}>
                        Add Certification
                      </button>
                    </div>

                    {/* certification */}
                    {/* Certifications Section */}
                    <div className="certificationscvtemplete form-groupcvtemplete sectioncvtemplete">
                      {/* Editable Section Title for Certifications */}
                      <p
                        className="titlescvtemplete editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "certification", "sectionTitles")}
                      >
                        {profile.sectionTitles.certification}
                      </p>
                      <hr className="hrformgroupcvtemplete" />

                      {/* Loop through each certification entry */}
                      {profile.certification.map((certification, index) => (
                        <div key={index} className="experience-itemcvtemplete">
                          {/* Editable Certification Title */}
                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Title:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={certification.title}
                              onChange={(e) => handleChange(e, "title", "certification", index)}
                            />
                          </div>

                          {/* Editable Dates */}
                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                            <input
                              className="forminputfieldcvtemplete"
                              type="text"
                              value={certification.date}
                              onChange={(e) => handleChange(e, "date", "certification", index)}
                            />
                          </div>

                          <div>
                            <label className="formlabelcvtemplete  mbformlabelcvtemplete">Description:</label>
                            <textarea
                              className="formgrouptextarea"
                              value={Array.isArray(certification.description) ? certification.description.join("\n") : ""}
                              onChange={(e) => {
                                const updatedValue = e.target.value;
                                const descriptionArray = updatedValue.split("\n").filter(item => item.trim() !== "");
                                const updatedCertifications = [...profile.certification];
                                updatedCertifications[index].description = descriptionArray;
                                setProfile({
                                  ...profile,
                                  certification: updatedCertifications,
                                });
                              }}
                            />
                          </div>

                          {/* Add Description Button */}
                          <button
                            className="Forminsidebuttons"
                            type="button"
                            onClick={() => {
                              const updatedCertifications = [...profile.certification]
                              updatedCertifications[index].description.push("") // Add empty description field
                              setProfile({
                                ...profile,
                                certification: updatedCertifications,
                              })
                            }}
                          >
                            Add Description
                          </button>

                          {/* Remove Certification Button */}
                          <div>
                            <button
                              className="Forminsidebuttons"
                              type="button"
                              onClick={() => removeCertification(index)}
                            >
                              Remove Certification
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Certification Button */}
                      <button className="Forminsidebuttons" type="button" onClick={addCertification}>
                        Add Certification
                      </button>
                    </div>

                    {/* Personal Details Section */}
                    <div className="form-groupcvtemplete">
                      <p className="titlescvtemplete">{profile.sectionTitles.personalDetails}</p>
                      <hr className="hrformgroupcvtemplete" />
                      <div>
                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">Date of Birth:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="date"
                          value={profile.personalDetails.dob}
                          onChange={(e) => handleChange(e, "dob", "personalDetails")}
                        />
                      </div>

                      <div>
                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">Gender:</label>
                        <select
                          className="forminputfieldcvtemplete"
                          value={profile.personalDetails.gender}
                          onChange={(e) => handleChange(e, "gender", "personalDetails")}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">Marital Status:</label>
                        <select
                          className="forminputfieldcvtemplete"
                          value={profile.personalDetails.maritalStatus}
                          onChange={(e) => handleChange(e, "maritalStatus", "personalDetails")}
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>

                      <div>
                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">Nationality:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={profile.personalDetails.nationality}
                          onChange={(e) => handleChange(e, "nationality", "personalDetails")}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="formeditcvtemplete" ref={formRef}>
            <div className="containercvtemplete">
              {/* <h2 className='resume_editor'>Resume Editor</h2> */}

              {/* Form Section */}
              <div className="form-sectioncvtemplete">
                {/* <h2 className="resume_editorcvtemplete">Resume</h2> */}
                <form>
                  {/* Personal Details */}
                  <div className="form-groupcvtemplete">
                    <p className="titlescvtemplete">{profile.sectionTitles.personalDetails}</p>
                    <hr className="hrformgroupcvtemplete" />
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">Full Name:</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="text"
                      value={profile.title.name}
                      onChange={(e) => handleChange(e, "name", "title")}
                    />
                  </div>

                  <div className="form-groupcvtemplete">
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">Designation:</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="text"
                      value={profile.title.designation}
                      onChange={(e) => handleChange(e, "designation", "title")}
                    />
                  </div>

                  <div className="form-groupcvtemplete">
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">Phone:</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="tel"
                      value={profile.contact.phone}
                      onChange={(e) => handleChange(e, "phone", "contact")}
                    />
                  </div>

                  <div className="form-groupcvtemplete">
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">Email:</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="email"
                      value={profile.contact.email}
                      onChange={(e) => handleChange(e, "email", "contact")}
                    />
                  </div>

                  <div className="form-groupcvtemplete">
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">Address:</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="text"
                      value={profile.contact.address}
                      onChange={(e) => handleChange(e, "address", "contact")}
                    />
                  </div>

                  {/* Professional Summary (About Me) */}
                  <div className="form-groupcvtemplete">
                    <p className="titlescvtemplete">{profile.sectionTitles.aboutMe}</p>
                    <hr className="hrformgroupcvtemplete" />
                    <textarea
                      className="formgrouptextarea"
                      value={profile.summary.aboutMe}
                      onChange={(e) => handleChange(e, "aboutMe", "summary")}
                    />
                  </div>

                  {/* Skills */}
                  <div className="form-groupcvtemplete">
                    <p className="titlescvtemplete">{profile.sectionTitles.skills}</p>
                    <hr className="hrformgroupcvtemplete" />
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">
                      Technical Skills (comma separated):
                    </label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="text"
                      value={profile.skills.technical.join(", ")}
                      onChange={(e) => handleChange(e, "technical", "skills")}
                    />
                  </div>

                  <div className="form-groupcvtemplete">
                    <label className="formlabelcvtemplete  mbformlabelcvtemplete">Soft Skills (comma separated):</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="text"
                      value={profile.skills.soft.join(", ")}
                      onChange={(e) => handleChange(e, "soft", "skills")}
                    />
                  </div>

                  {/* Experience */}
                  <div className="formexperience">
                    <p className="titlescvtemplete">{profile.sectionTitles.experience}</p>
                    <hr className="hrformgroupcvtemplete" />
                    {/* Loop through each experience entry */}
                    {profile.experience.map((exp, index) => (
                      <div key={index}>
                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Job Title:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={exp.title}
                            onChange={(e) => handleChange(e, "title", "experience", index)}
                          />
                        </div>

                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Company:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleChange(e, "company", "experience", index)}
                          />
                        </div>

                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={exp.dates}
                            onChange={(e) => handleChange(e, "dates", "experience", index)}
                          />
                        </div>

                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Description:</label>
                          <textarea
                            className="formgrouptextarea"
                            value={Array.isArray(exp.description) ? exp.description.join("\n") : ""}
                            onChange={(e) => handleChange(e, "description", "experience", index)}
                          />
                        </div>

                        {/* Remove Experience Button - only show when there's more than one experience */}
                        {profile.experience.length > 1 && (
                          <button className="Forminsidebuttons" type="button" onClick={() => removeExperience(index)}>
                            Remove Experience
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Add Experience Button */}
                    <button className="Forminsidebuttons" type="button" onClick={addExperience}>
                      Add Experience
                    </button>
                  </div>

                  {/* Education */}
                  <div className="form-groupcvtemplete">
                    <p className="titlescvtemplete">{profile.sectionTitles.education}</p>
                    <hr className="hrformgroupcvtemplete" />
                    {profile.education.map((edu, index) => (
                      <div key={index}>
                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">College/School:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={edu.college}
                          onChange={(e) => handleChange(e, "college", "education", index)}
                        />

                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">Course:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={edu.course}
                          onChange={(e) => handleChange(e, "course", "education", index)}
                        />

                        <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={edu.dates}
                          onChange={(e) => handleChange(e, "dates", "education", index)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Certifications */}
                  <div className="certificationscvtemplete">
                    {/* Editable Section Title for Certifications */}
                    <p
                      className="titlescvtemplete editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "certifications", "sectionTitles")}
                    >
                      {profile.sectionTitles.certifications}
                    </p>
                    <hr className="hrformgroupcvtemplete" />

                    {/* Loop through each certification entry */}
                    {profile.certifications.map((certification, index) => (
                      <div key={index} className="experience-itemcvtemplete">
                        {/* Editable Certification Title and Dates */}
                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Title:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={certification.title}
                            onChange={(e) => handleChange(e, "title", "certifications", index)}
                          />
                        </div>

                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={certification.dates}
                            onChange={(e) => handleChange(e, "dates", "certifications", index)}
                          />
                        </div>

                        {/* Editable Description List */}
                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Description:</label>
                          <textarea
                            className="formgrouptextarea"
                            value={Array.isArray(certification.description) ? certification.description.join("\n") : ""}
                            onChange={(e) => {
                              const updatedValue = e.target.value;
                              const descriptionArray = updatedValue.split("\n").filter(item => item.trim() !== "");
                              const updatedCertifications = [...profile.certifications];
                              updatedCertifications[index].description = descriptionArray;
                              setProfile({
                                ...profile,
                                certifications: updatedCertifications,
                              });
                            }}
                          />
                        </div>

                        {/* Add Description Button */}
                        <button
                          className="Forminsidebuttons"
                          type="button"
                          onClick={() => {
                            const updatedCertifications = [...profile.certifications]
                            updatedCertifications[index].description.push("") // Add empty description field
                            setProfile({
                              ...profile,
                              certifications: updatedCertifications,
                            })
                          }}
                        >
                          Add Description
                        </button>
                        <div>
                          {/* Remove Certification Button */}
                          <button
                            className="Forminsidebuttons"
                            type="button"
                            onClick={() => removeCertification(index)}
                          >
                            Remove Certification
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Certification Button */}
                    <button className="Forminsidebuttons" type="button" onClick={addCertification}>
                      Add Certification
                    </button>
                  </div>

                  {/* certification */}
                  {/* Certifications Section */}
                  <div className="certificationscvtemplete form-groupcvtemplete sectioncvtemplete">
                    {/* Editable Section Title for Certifications */}
                    <p
                      className="titlescvtemplete editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "certification", "sectionTitles")}
                    >
                      {profile.sectionTitles.certification}
                    </p>
                    <hr className="hrformgroupcvtemplete" />

                    {/* Loop through each certification entry */}
                    {profile.certification.map((certification, index) => (
                      <div key={index} className="experience-itemcvtemplete">
                        {/* Editable Certification Title */}
                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Title:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={certification.title}
                            onChange={(e) => handleChange(e, "title", "certification", index)}
                          />
                        </div>

                        {/* Editable Dates */}
                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Dates:</label>
                          <input
                            className="forminputfieldcvtemplete"
                            type="text"
                            value={certification.date}
                            onChange={(e) => handleChange(e, "date", "certification", index)}
                          />
                        </div>

                        <div>
                          <label className="formlabelcvtemplete  mbformlabelcvtemplete">Description:</label>
                          <textarea
                            className="formgrouptextarea"
                            value={Array.isArray(certification.description) ? certification.description.join("\n") : ""}
                            onChange={(e) => {
                              const updatedValue = e.target.value;
                              const descriptionArray = updatedValue.split("\n").filter(item => item.trim() !== "");
                              const updatedCertifications = [...profile.certification];
                              updatedCertifications[index].description = descriptionArray;
                              setProfile({
                                ...profile,
                                certification: updatedCertifications,
                              });
                            }}
                          />
                        </div>

                        {/* Add Description Button */}
                        <button
                          className="Forminsidebuttons"
                          type="button"
                          onClick={() => {
                            const updatedCertifications = [...profile.certification]
                            updatedCertifications[index].description.push("") // Add empty description field
                            setProfile({
                              ...profile,
                              certification: updatedCertifications,
                            })
                          }}
                        >
                          Add Description
                        </button>

                        {/* Remove Certification Button */}
                        <div>
                          <button
                            className="Forminsidebuttons"
                            type="button"
                            onClick={() => removeCertification(index)}
                          >
                            Remove Certification
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Certification Button */}
                    <button className="Forminsidebuttons" type="button" onClick={addCertification}>
                      Add Certification
                    </button>
                  </div>

                  {/* Personal Details Section */}
                  <div className="form-groupcvtemplete">
                    <p className="titlescvtemplete">{profile.sectionTitles.personalDetails}</p>
                    <hr className="hrformgroupcvtemplete" />
                    <div>
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Date of Birth:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="date"
                        value={profile.personalDetails.dob}
                        onChange={(e) => handleChange(e, "dob", "personalDetails")}
                      />
                    </div>

                    <div>
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Gender:</label>
                      <select
                        className="forminputfieldcvtemplete"
                        value={profile.personalDetails.gender}
                        onChange={(e) => handleChange(e, "gender", "personalDetails")}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Marital Status:</label>
                      <select
                        className="forminputfieldcvtemplete"
                        value={profile.personalDetails.maritalStatus}
                        onChange={(e) => handleChange(e, "maritalStatus", "personalDetails")}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    <div>
                      <label className="formlabelcvtemplete  mbformlabelcvtemplete">Nationality:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={profile.personalDetails.nationality}
                        onChange={(e) => handleChange(e, "nationality", "personalDetails")}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {cvFromApplicantForm ? (
          stateforToggleResumePreview && (
            <div className="maincvtemeplete" id="profileContainercvtemplete">
              <div className="maindivcvtemplete">
                <div className="contactcvtemplete sectioncvtemplete">
                  <div className="namecvtemplete-name-div">
                    <p
                      className="namecvtemplete editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "name")}
                      suppressContentEditableWarning={true}
                    >
                      {profile.title.name}
                    </p>
                    {
                      cvFromApplicantForm && (
                        <button onClick={onClose} className="resume-close-btn">
                        {" "}
                        &times;
                      </button>
                      )
                    }
                   
                  </div>

                  <p
                    className="designationcvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "designation")}
                    suppressContentEditableWarning={true}
                  >
                    {profile.title.designation}
                  </p>
                  <hr className="hrcvtemplete" />
                  <div className="detailscvtemplete">
                    {/* Editable Email */}
                    <p
                      className="emailcvtemplete editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "email")}
                      suppressContentEditableWarning={true}
                    >
                      <strong>Email:</strong> {profile.contact.email}
                    </p>
                    {/* Editable Phone */}
                    <p
                      className="phonecvtemplete editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "phone")}
                      suppressContentEditableWarning={true}
                    >
                      <strong>Phone:</strong> {profile.contact.phone}
                    </p>
                    {/* Editable Location */}
                    {/* <p 
                className="location editable-text" 
                contentEditable={true} 
                onBlur={(e) => handleChange(e, "address")}
              >
                <strong>Location:</strong> {profile.contact.address}
              </p> */}
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="summarycvtemplete sectioncvtemplete">
                  {/* Editable Title for About Me */}
                  <p
                    className="titlescvtemplete aboutme editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "aboutMeTitle")}
                  >
                    {profile.sectionTitles.aboutMe}
                  </p>
                  <hr className="hrcvtemplete" />
                  {/* Editable Summary Text */}
                  <p
                    className="summarytextcvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "aboutMe")}
                  >
                    {profile.summary.aboutMe}
                  </p>
                </div>

                <div className="skillscvtemplete sectioncvtemplete">
                  {/* Editable Title for Core Competencies */}
                  <p
                    className="titlescvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "skillsTitle")}
                  >
                    {profile.sectionTitles.skills}
                  </p>
                  <hr className="hrcvtemplete" />

                  {/* Editable Technical Skills */}
                  <div className="skill-setcvtemplete">
                    <strong>
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "technicalSkillsTitle")}
                      >
                        Technical Skills:
                      </span>
                    </strong>
                    <ul className="technicalskillulcvtemplete">
                      {profile.skills.technical.map((skill, index) => (
                        <li
                          className="skillslilistcvtemplete"
                          key={index}
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `technicalSkill-${index}`)}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Editable Soft Skills */}
                  <div className="skill-setcvtemplete">
                    <strong>
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "softSkillsTitle")}
                      >
                        Soft Skills:
                      </span>
                    </strong>
                    <ul className="technicalskillulcvtemplete">
                      {profile.skills.soft.map((skill, index) => (
                        <li
                          className="skillslilistcvtemplete"
                          key={index}
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `softSkill-${index}`)}
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="experiencecvtemplete sectioncvtemplete">
                  {/* Check if profile.sectionTitles and profile.experience are available */}
                  {profile && profile.sectionTitles && profile.experience ? (
                    <>
                      {/* Editable Title for Professional Experience */}
                      <p
                        className="titlescvtemplete editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "experienceTitle")}
                      >
                        {profile.sectionTitles.experience}
                      </p>
                      <hr className="hrcvtemplete" />

                      {profile.experience.map((exp, index) => (
                        <div key={index} className="experience-itemcvtemplete">
                          {/* Editable Job Title, Company Name, and Dates */}
                          <h3 className="experience-itemheadingcvtemplete">
                            <span
                              className="editable-text"
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, `experience-${index}-title`)}
                            >
                              {exp.title}
                            </span>
                            at
                            <span
                              className="editable-text"
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, `experience-${index}-company`)}
                            >
                              {exp.company}
                            </span>
                            ({" "}
                            <span
                              className="editable-text"
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, `experience-${index}-dates`)}
                            >
                              {exp.dates}
                            </span>
                            )
                          </h3>

                          {/* Editable Description List */}
                          {exp.description && Array.isArray(exp.description) && exp.description.length > 0 ? (
                            <ul className="experience-descriptioncvtemplete">
                              {exp.description.map((point, idx) => (
                                <li
                                  className="listinsertcvtemplete"
                                  key={idx}
                                  contentEditable={true}
                                  onBlur={(e) => handleChange(e, `experience-${index}-description-${idx}`)}
                                >
                                  {point}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="cvtempletecertification">No experience description available.</p>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>Loading or no experience data available.</p>
                  )}
                </div>

                <div className="certificationscvtemplete sectioncvtemplete">
                  {/* Editable Section Title for Certifications */}
                  <p
                    className="titlescvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "certificationsTitle")}
                  >
                    {profile.sectionTitles.certifications}
                  </p>
                  <hr className="hrcvtemplete" />

                  {/* Check if certifications is defined and is an array */}
                  {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? (
                    profile.certifications.map((certification, index) => (
                      <div key={index} className="experience-itemcvtemplete">
                        {/* Editable Certification Title and Dates */}
                        <h3 className="experience-itemheadingcvtemplete">
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `certification-${index}-title`)}
                          >
                            {certification.title}
                          </span>
                          ({" "}
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `certification-${index}-dates`)}
                          >
                            {certification.dates}
                          </span>
                          )
                        </h3>

                        {/* Editable Description List */}
                        {Array.isArray(certification.description) && certification.description.length > 0 ? (
                          <ul className="experience-descriptioncvtemplete">
                            {certification.description.map((point, idx) => (
                              <li
                                className="listinsertcvtemplete"
                                key={idx}
                                contentEditable={true}
                                onBlur={(e) => handleChange(e, `certification-${index}-description-${idx}`)}
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No description available.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="cvtempletecertification">No certifications available.</p> // If no certifications, show a fallback message
                  )}
                </div>

                {/* Certifications */}
                <div className="certificationcvtemplete sectioncvtemplete">
                  {/* Editable Section Title for Certifications */}
                  <p
                    className="titlescvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "certificationTitle")}
                  >
                    {profile.sectionTitles.certification}
                  </p>
                  <hr className="hrcvtemplete" />

                  {/* Check if certification is defined and is an array */}
                  {Array.isArray(profile.certification) && profile.certification.length > 0 ? (
                    profile.certification.map((certification, index) => (
                      <div key={index} className="experience-itemcvtemplete">
                        {/* Editable Certification Title and Date */}
                        <h3 className="experience-itemheadingcvtemplete">
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `certification-${index}-title`)}
                          >
                            {certification.title}
                          </span>
                          {" ("}
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `certification-${index}-date`)}
                          >
                            {certification.date}
                          </span>
                          {")"}
                        </h3>

                        {/* Editable Certification Description */}
                        {Array.isArray(certification.description) && certification.description.length > 0 ? (
                          <ul className="experience-descriptioncvtemplete">
                            {certification.description.map((point, idx) => (
                              <li
                                className="listinsertcvtemplete"
                                key={idx}
                                contentEditable={true}
                                onBlur={(e) => handleChange(e, `certification-${index}-description-${idx}`)}
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No description available.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="cvtempletecertification">No certifications available.</p>
                  )}
                </div>

                {/* Education */}
                <div className="educationcvtemplete sectioncvtemplete">
                  {/* Editable Education Section Title */}
                  <p
                    className="titlescvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "educationTitle")}
                  >
                    {profile.sectionTitles.education}
                  </p>
                  <hr className="hrcvtemplete" />

                  {profile.education && profile.education.length > 0 ? (
                    profile.education.map((edu, index) => (
                      <div key={index} className="education-item">
                        {/* Editable Education Details */}
                        <h4>
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `education-${index}-course`)}
                          >
                            {edu.course}
                          </span>
                          {" at "}
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `education-${index}-college`)}
                          >
                            {edu.college}
                          </span>
                          {" ("}
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `education-${index}-dates`)}
                          >
                            {edu.dates}
                          </span>
                          {")"}
                        </h4>
                      </div>
                    ))
                  ) : (
                    <p>No education details available.</p>
                  )}
                </div>

                {/* Personal Details */}
                <div className="personaldetailscvtemplete sectioncvtemplete">
                  {/* Editable Personal Details Section Title */}
                  <p
                    className="titlescvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "personalDetailsTitle")}
                  >
                    {profile.sectionTitles.personalDetails}
                  </p>
                  <hr className="hrcvtemplete" />

                  <div className="personal-infocvtemplete">
                    {/* Editable Date of Birth */}
                    <p className="personalcvtemplete">
                      <strong>Date of Birth:</strong>
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "personalDetails-dob")}
                      >
                        {profile.personalDetails.dob}
                      </span>
                    </p>

                    {/* Editable Gender */}
                    <p className="personalcvtemplete">
                      <strong>Gender:</strong>
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "personalDetails-gender")}
                      >
                        {profile.personalDetails.gender}
                      </span>
                    </p>

                    {/* Editable Marital Status */}
                    <p className="personalcvtemplete">
                      <strong>Marital Status:</strong>
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "personalDetails-maritalStatus")}
                      >
                        {profile.personalDetails.maritalStatus}
                      </span>
                    </p>

                    {/* Editable Nationality */}
                    <p className="personalcvtemplete">
                      <strong>Nationality:</strong>
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, "personalDetails-nationality")}
                      >
                        {profile.personalDetails.nationality}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="buttondivcvtemplete">
                  {/* <button className="button"  id = "downloadButton">Download PDF</button> */}
                  <button className="downloadendingbuttoncvtemplete cvdownloadbutton" onClick={downloadPDF}>
                    Download
                  </button>
                  {
                    cvFromApplicantForm && (
                      <button className="downloadendingbuttoncvtemplete" onClick={handleSetCV} >
                      Set Cv
                     </button>
                    )
                  }
                
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="maincvtemeplete" id="profileContainercvtemplete">
            <div className="maindivcvtemplete">
              <div className="contactcvtemplete sectioncvtemplete">
                <div className="namecvtemplete-name-div">
                  <p
                    className="namecvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "name")}
                    suppressContentEditableWarning={true}
                  >
                    {profile.title.name}
                  </p>
                  {/* <button onClick={onClose} className="resume-close-btn">
                    {" "}
                    &times;
                  </button> */}
                </div>

                <p
                  className="designationcvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "designation")}
                  suppressContentEditableWarning={true}
                >
                  {profile.title.designation}
                </p>
                <hr className="hrcvtemplete" />
                <div className="detailscvtemplete">
                  {/* Editable Email */}
                  <p
                    className="emailcvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "email")}
                    suppressContentEditableWarning={true}
                  >
                    <strong>Email:</strong> {profile.contact.email}
                  </p>
                  {/* Editable Phone */}
                  <p
                    className="phonecvtemplete editable-text"
                    contentEditable={true}
                    onBlur={(e) => handleChange(e, "phone")}
                    suppressContentEditableWarning={true}
                  >
                    <strong>Phone:</strong> {profile.contact.phone}
                  </p>
                  {/* Editable Location */}
                  {/* <p 
          className="location editable-text" 
          contentEditable={true} 
          onBlur={(e) => handleChange(e, "address")}
        >
          <strong>Location:</strong> {profile.contact.address}
        </p> */}
                </div>
              </div>

              {/* Professional Summary */}
              <div className="summarycvtemplete sectioncvtemplete">
                {/* Editable Title for About Me */}
                <p
                  className="titlescvtemplete aboutme editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "aboutMeTitle")}
                >
                  {profile.sectionTitles.aboutMe}
                </p>
                <hr className="hrcvtemplete" />
                {/* Editable Summary Text */}
                <p
                  className="summarytextcvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "aboutMe")}
                >
                  {profile.summary.aboutMe}
                </p>
              </div>

              <div className="skillscvtemplete sectioncvtemplete">
                {/* Editable Title for Core Competencies */}
                <p
                  className="titlescvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "skillsTitle")}
                >
                  {profile.sectionTitles.skills}
                </p>
                <hr className="hrcvtemplete" />

                {/* Editable Technical Skills */}
                <div className="skill-setcvtemplete">
                  <strong>
                    <span
                      className="editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "technicalSkillsTitle")}
                    >
                      Technical Skills:
                    </span>
                  </strong>
                  <ul className="technicalskillulcvtemplete">
                    {profile.skills.technical.map((skill, index) => (
                      <li
                        className="skillslilistcvtemplete"
                        key={index}
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, `technicalSkill-${index}`)}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Editable Soft Skills */}
                <div className="skill-setcvtemplete">
                  <strong>
                    <span
                      className="editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "softSkillsTitle")}
                    >
                      Soft Skills:
                    </span>
                  </strong>
                  <ul className="technicalskillulcvtemplete">
                    {profile.skills.soft.map((skill, index) => (
                      <li
                        className="skillslilistcvtemplete"
                        key={index}
                        contentEditable={true}
                        onBlur={(e) => handleChange(e, `softSkill-${index}`)}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="experiencecvtemplete sectioncvtemplete">
                {/* Check if profile.sectionTitles and profile.experience are available */}
                {profile && profile.sectionTitles && profile.experience ? (
                  <>
                    {/* Editable Title for Professional Experience */}
                    <p
                      className="titlescvtemplete editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "experienceTitle")}
                    >
                      {profile.sectionTitles.experience}
                    </p>
                    <hr className="hrcvtemplete" />

                    {profile.experience.map((exp, index) => (
                      <div key={index} className="experience-itemcvtemplete">
                        {/* Editable Job Title, Company Name, and Dates */}
                        <h3 className="experience-itemheadingcvtemplete">
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `experience-${index}-title`)}
                          >
                            {exp.title}
                          </span>
                          at
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `experience-${index}-company`)}
                          >
                            {exp.company}
                          </span>
                          ({" "}
                          <span
                            className="editable-text"
                            contentEditable={true}
                            onBlur={(e) => handleChange(e, `experience-${index}-dates`)}
                          >
                            {exp.dates}
                          </span>
                          )
                        </h3>

                        {/* Editable Description List */}
                        {exp.description && Array.isArray(exp.description) && exp.description.length > 0 ? (
                          <ul className="experience-descriptioncvtemplete">
                            {exp.description.map((point, idx) => (
                              <li
                                className="listinsertcvtemplete"
                                key={idx}
                                contentEditable={true}
                                onBlur={(e) => handleChange(e, `experience-${index}-description-${idx}`)}
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="cvtempletecertification">No experience description available.</p>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <p>Loading or no experience data available.</p>
                )}
              </div>

              <div className="certificationscvtemplete sectioncvtemplete">
                {/* Editable Section Title for Certifications */}
                <p
                  className="titlescvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "certificationsTitle")}
                >
                  {profile.sectionTitles.certifications}
                </p>
                <hr className="hrcvtemplete" />

                {/* Check if certifications is defined and is an array */}
                {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? (
                  profile.certifications.map((certification, index) => (
                    <div key={index} className="experience-itemcvtemplete">
                      {/* Editable Certification Title and Dates */}
                      <h3 className="experience-itemheadingcvtemplete">
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `certification-${index}-title`)}
                        >
                          {certification.title}
                        </span>
                        ({" "}
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `certification-${index}-dates`)}
                        >
                          {certification.dates}
                        </span>
                        )
                      </h3>

                      {/* Editable Description List */}
                      {Array.isArray(certification.description) && certification.description.length > 0 ? (
                        <ul className="experience-descriptioncvtemplete">
                          {certification.description.map((point, idx) => (
                            <li
                              className="listinsertcvtemplete"
                              key={idx}
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, `certification-${index}-description-${idx}`)}
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No description available.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="cvtempletecertification">No certifications available.</p> // If no certifications, show a fallback message
                )}
              </div>

              {/* Certifications */}
              <div className="certificationcvtemplete sectioncvtemplete">
                {/* Editable Section Title for Certifications */}
                <p
                  className="titlescvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "certificationTitle")}
                >
                  {profile.sectionTitles.certification}
                </p>
                <hr className="hrcvtemplete" />

                {/* Check if certification is defined and is an array */}
                {Array.isArray(profile.certification) && profile.certification.length > 0 ? (
                  profile.certification.map((certification, index) => (
                    <div key={index} className="experience-itemcvtemplete">
                      {/* Editable Certification Title and Date */}
                      <h3 className="experience-itemheadingcvtemplete">
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `certification-${index}-title`)}
                        >
                          {certification.title}
                        </span>
                        {" ("}
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `certification-${index}-date`)}
                        >
                          {certification.date}
                        </span>
                        {")"}
                      </h3>

                      {/* Editable Certification Description */}
                      {Array.isArray(certification.description) && certification.description.length > 0 ? (
                        <ul className="experience-descriptioncvtemplete">
                          {certification.description.map((point, idx) => (
                            <li
                              className="listinsertcvtemplete"
                              key={idx}
                              contentEditable={true}
                              onBlur={(e) => handleChange(e, `certification-${index}-description-${idx}`)}
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No description available.</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="cvtempletecertification">No certifications available.</p>
                )}
              </div>

              {/* Education */}
              <div className="educationcvtemplete sectioncvtemplete">
                {/* Editable Education Section Title */}
                <p
                  className="titlescvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "educationTitle")}
                >
                  {profile.sectionTitles.education}
                </p>
                <hr className="hrcvtemplete" />

                {profile.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      {/* Editable Education Details */}
                      <h4>
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `education-${index}-course`)}
                        >
                          {edu.course}
                        </span>
                        {" at "}
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `education-${index}-college`)}
                        >
                          {edu.college}
                        </span>
                        {" ("}
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) => handleChange(e, `education-${index}-dates`)}
                        >
                          {edu.dates}
                        </span>
                        {")"}
                      </h4>
                    </div>
                  ))
                ) : (
                  <p>No education details available.</p>
                )}
              </div>

              {/* Personal Details */}
              <div className="personaldetailscvtemplete sectioncvtemplete">
                {/* Editable Personal Details Section Title */}
                <p
                  className="titlescvtemplete editable-text"
                  contentEditable={true}
                  onBlur={(e) => handleChange(e, "personalDetailsTitle")}
                >
                  {profile.sectionTitles.personalDetails}
                </p>
                <hr className="hrcvtemplete" />

                <div className="personal-infocvtemplete">
                  {/* Editable Date of Birth */}
                  <p className="personalcvtemplete">
                    <strong>Date of Birth:</strong>
                    <span
                      className="editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "personalDetails-dob")}
                    >
                      {profile.personalDetails.dob}
                    </span>
                  </p>

                  {/* Editable Gender */}
                  <p className="personalcvtemplete">
                    <strong>Gender:</strong>
                    <span
                      className="editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "personalDetails-gender")}
                    >
                      {profile.personalDetails.gender}
                    </span>
                  </p>

                  {/* Editable Marital Status */}
                  <p className="personalcvtemplete">
                    <strong>Marital Status:</strong>
                    <span
                      className="editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "personalDetails-maritalStatus")}
                    >
                      {profile.personalDetails.maritalStatus}
                    </span>
                  </p>

                  {/* Editable Nationality */}
                  <p className="personalcvtemplete">
                    <strong>Nationality:</strong>
                    <span
                      className="editable-text"
                      contentEditable={true}
                      onBlur={(e) => handleChange(e, "personalDetails-nationality")}
                    >
                      {profile.personalDetails.nationality}
                    </span>
                  </p>
                </div>
              </div>
{/* Rajlaxmi jagadale added taht code */}
              <div className="buttondivcvtemplete">
                {/* <button className="button"  id = "downloadButton">Download PDF</button> */}
                <button className="downloadendingbuttoncvtemplete cvdownloadbutton" onClick={downloadPDF}>
                  Download
                </button>
                {
                  cvFromApplicantForm && (
                    <button className="downloadendingbuttoncvtemplete" onClick={handleSetCV}>
                    Set Cv
                  </button>
                  )
                }
               
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
export default CvTemplate;
