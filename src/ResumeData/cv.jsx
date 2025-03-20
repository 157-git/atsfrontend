import React, { useState } from "react";
import "./cv.css";
// import { jsPDF } from "jspdf";
// import html2pdf from 'html2pdf.js';
// import FormEdit from "./FormEdit";
// import Main from "./Resume";
// import Resume from './Resume';

// Name: Afreen Sanaulla
// Title: CV
// Description : Completely edidatable cv with inputs and option od pdf download
// Lines: 1213
function CvTemplate({ onClose }) {
  const [isEditing, setIsEditing] = useState(false); // This is necessary for toggling between view/edit

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
    summary: {
      aboutMe:
        "Highly experienced Business Consultant with over 10 years of expertise in leading teams, strategic consulting, and driving business transformations. Proven ability to develop innovative solutions and deliver measurable results across diverse industries.",
    },
    title: {
      name: "Olivia Schumacher",
      designation: "Senior Business Consultant",
    },
    contact: {
      phone: "9876543210",
      email: "olivia.schumacher@email.com",
      address: "Pune, Maharashtra, India",
    },
    skills: {
      technical: [
        "Business Strategy",
        "Team Leadership",
        "Financial Planning",
        "Data Analytics",
        "Change Management",
      ],
      soft: [
        "Leadership",
        "Problem-Solving",
        "Client Relations",
        "Communication",
        "Negotiation",
      ],
    },
    experience: [
      {
        title: "Senior Business Consultant ",
        company: " TechCorp Pvt Ltd",
        dates: "2018 - Present",
        description: [
          "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
          "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
          "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
          "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
          "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
          "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
        ],
      },
      {
        title: "Business Consultant ",
        company: " Innovate Solutions",
        dates: "2015 - 2018",
        description: [
          "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
          "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
          "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
          "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
          "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
          "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
        ],
      },
      {
        title: "Senior Business Consultant ",
        company: " TechCorp Pvt Ltd",
        dates: " 2012 - 2013",
        description: [
          "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
          "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
          "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
          "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
          "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
          "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
        ],
      },
      {
        title: "Senior Business Consultant ",
        company: " TechCorp Pvt Ltd",
        dates: " 2012 - 2013",
        description: [
          "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
          "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
          "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
          "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
          "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
          "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
        ],
      },
      {
        title: "Senior Business Consultant ",
        company: " TechCorp Pvt Ltd",
        dates: " 2012 - 2013",
        description: [
          "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
          "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
          "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
          "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
          "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
          "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
        ],
      },
      {
        title: "Senior Business Consultant ",
        company: " TechCorp Pvt Ltd",
        dates: " 2012 - 2013",
        description: [
          "Spearheaded strategic transformation initiatives for Fortune 500 clients, delivering a 25% average improvement in operational efficiency.",
          "Managed a diverse team of 12 consultants across multiple projects, ensuring successful delivery of complex business strategies and high-impact solutions.",
          "Advised senior executives on business operations, providing actionable insights that drove a 20% increase in annual revenue for multiple clients.",
          "Led cross-functional teams in agile environments to design and implement scalable solutions across industries, including Finance, Healthcare, and Manufacturing.",
          "Conducted in-depth market research and competitive analysis, aiding in client portfolio diversification and the successful launch of new product lines.",
          "Facilitated workshops and seminars on change management and organizational development for key stakeholders.",
        ],
      },
    ],
    education: [
      {
        college: "Arihant Business School",
        course: "Master of Business Administration ",
        dates: "2013 - 2015",
      },
      {
        college: "Ness Wadia",
        course: "Bachelor of Business Administration ",
        dates: "2013 - 2015",
      },
      {
        college: "Vatsalya School",
        course: "High School",
        dates: "2013 - 2015",
      },
      {
        college: "Vatsalya School",
        course: "High School",
        dates: "2013 - 2015",
      },
    ],
    certifications: [
      {
        title: "Digital Transformation for Global Bank",
        dates: "2020 - 2021",
        description: [
          "Managed a team of 10 consultants to execute a multi-phase digital transformation project for a leading global bank.",
          "Implemented AI-driven financial tools and automated business processes, reducing manual effort by 40% and improving customer satisfaction by 30%.",
          "Led workshops to train staff and executives on the new technologies, ensuring seamless adoption of new systems across departments.",
          "Resulted in the client reducing operational costs by $5M annually and improving overall customer retention by 25%.",
        ],
      },
      {
        title:
          "Enterprise Resource Planning (ERP) Implementation for Retail Giant",
        dates: "2019",
        description: [
          "Led a 12-month ERP implementation project for a multinational retail company, optimizing business functions including inventory management, HR, and accounting.",
          "Integrated legacy systems with new software, improving data accuracy and operational efficiency across the organization.",
          "Project reduced inventory-related issues by 50%, streamlined payroll processing, and provided real-time insights into key business metrics.",
          "Successfully trained 300+ employees on the new system, ensuring a smooth transition with minimal disruptions.",
        ],
      },
      {
        title: "Supply Chain Optimization for Manufacturing Client",
        dates: "2018",
        description: [
          "Spearheaded the redesign of the supply chain strategy for a global manufacturing client, focusing on optimizing sourcing, inventory management, and logistics.",
          "Leveraged data analytics and machine learning models to predict supply chain disruptions and optimize product delivery.",
          "Project reduced supply chain delays by 35% and saved the client $3M annually in logistics and inventory costs.",
          "Collaborated with the client's IT department to integrate IoT technology for real-time tracking and better decision-making.",
        ],
      },
    ],
    certification: [
      {
        title: "AWS Certified Solutions Architect – Associate",
        date: "2021",
        description: [
          "Proficient in designing and deploying scalable and highly available systems on AWS.",
          "Experienced with AWS services such as EC2, S3, RDS, Lambda, and CloudFormation.",
          "Ability to design cost-effective, fault-tolerant, and scalable cloud architectures.",
          "Skills in security, networking, and operational best practices for AWS environments.",
        ],
      },
      {
        title: "Certified Scrum Master (CSM)",
        date: " 2019",
        description: [
          "Certified Scrum Master with in-depth knowledge of Scrum principles and Agile methodologies.",
          "Successfully facilitated Scrum ceremonies such as daily stand-ups, sprint planning, and retrospectives.",
          "Led teams in a collaborative, transparent environment, focusing on delivering high-quality software products.",
          "Guided and coached teams and product owners to adhere to Scrum practices and improve team performance.",
        ],
      },
      {
        title: "Certified Information Systems Security Professional (CISSP)",
        date: " 2019",
        description: [
          "Advanced expertise in designing, implementing, and managing cybersecurity programs.",
          "Skilled in risk management, asset security, and security engineering across IT systems.",
          "Experience conducting security audits, threat modeling, and penetration testing.",
          "In-depth knowledge of industry standards and regulations such as GDPR, HIPAA, and NIST.",
        ],
      },
      {
        title: "Project Management Professional (PMP)",
        date: " 2019",
        description: [
          "Certified PMP with expertise in managing complex, multi-phase projects across diverse industries.",
          "Strong ability to define project scope, manage stakeholders, and oversee project delivery on time and within budget.",
          "Proficient in risk management, resource allocation, and strategic project planning.",
          "Successfully led projects with cross-functional teams, meeting both scope and financial goals.",
        ],
      },
      {
        title: "Certified Scrum Master (CSM)",
        date: " 2019",
        description: [
          "Certified Scrum Master with expertise in Agile project management.",
          "Facilitated Scrum ceremonies and assisted teams in achieving their Sprint goals.",
          "Promoted Agile best practices, ensuring timely delivery of projects and increased collaboration.",
          "Provided coaching to teams and stakeholders on Agile principles and frameworks.",
        ],
      },
      {
        title: "Google Cloud Professional Cloud Architect",
        date: " 2019",
        description: [
          "Specialized in designing, deploying, and managing solutions on Google Cloud Platform (GCP).",
          "Experienced in designing infrastructure for compute, networking, storage, and big data solutions on GCP.",
          "Led cloud migration and optimization projects, reducing infrastructure costs while increasing performance.",
          "Proficient in Kubernetes, machine learning tools, and building scalable architectures on GCP.",
        ],
      },
    ],
    personalDetails: {
      dob: "1/2/1985",
      gender: "Female",
      maritalStatus: "Single",
      nationality: "Indian",
    },
  });
  const handlePrint = () => {
    // Get the elements we want to hide for printing (excluding the main content)
    const otherContent = document.querySelectorAll(
      ".formeditcvtemplete, .candidateidcvtemplete"
    ); // Select elements you want to hide
    const mainContent = document.querySelector(".main"); // Content you want to remain visible during print

    // Hide all unwanted content
    otherContent.forEach((element) => {
      element.style.display = "none";
    });

    // Show the print dialog after 2 seconds
    setTimeout(() => {
      window.print(); // Open print dialog
    }, 2000); // Wait for 2 seconds

    // After printing, restore the visibility of the content
    setTimeout(() => {
      otherContent.forEach((element) => {
        element.style.display = ""; // Reset display to default (visible)
      });
    }, 2500); // Wait for a bit after print dialog closes to restore visibility
  };

  const handleChange = (e, field, section, index = null) => {
    const value = e.target.value;
    console.log(
      "Updating field:",
      field,
      "in section:",
      section,
      "at index:",
      index,
      "with value:",
      value
    );

    setProfile((prevProfile) => {
      const updatedProfile = { ...prevProfile };

      console.log("Previous profile state:", prevProfile);

      if (!updatedProfile[section]) {
        console.warn(`Section "${section}" is not defined, initializing...`);
        updatedProfile[section] = Array.isArray(value) ? [] : {}; // Initialize section if not present
      }

      if (index !== null) {
        if (!updatedProfile[section][index]) {
          console.warn(
            `Index "${index}" does not exist in section "${section}", initializing...`
          );
          updatedProfile[section][index] = {}; // Initialize item if it doesn't exist at the index
        }

        updatedProfile[section][index][field] = value;
      } else if (section === "skills") {
        updatedProfile[section][field] = value
          .split(",")
          .map((item) => item.trim());
      } else {
        updatedProfile[section][field] = value;
      }

      console.log("Updated profile state:", updatedProfile);

      return updatedProfile;
    });
  };

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
    }));
  };

  // Handle removing an experience entry
  const removeExperience = (index) => {
    setProfile((prevProfile) => {
      const updatedExperience = prevProfile.experience.filter(
        (_, idx) => idx !== index
      );
      return { ...prevProfile, experience: updatedExperience };
    });
  };

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
    }));
  };

  // Handle removing a certification entry
  const removeCertification = (index) => {
    setProfile((prevProfile) => {
      const updatedCertifications = prevProfile.certifications.filter(
        (_, idx) => idx !== index
      );
      return { ...prevProfile, certifications: updatedCertifications };
    });
  };
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
      <div className="candidateidcvtemplete-top-close-div"></div>
      <div className="mainflexdivcvtemplete">
        {/* form staart */}
        <div className="formeditcvtemplete">
          <div className="containercvtemplete">
            {/* <h2 className='resume_editor'>Resume Editor</h2> */}

            {/* Form Section */}
            <div className="form-sectioncvtemplete">
              {/* <h2 className="resume_editorcvtemplete">Resume</h2> */}
              <form>
                {/* Personal Details */}
                <div className="form-groupcvtemplete">
                  <p className="titlescvtemplete">
                    {profile.sectionTitles.personalDetails}
                  </p>
                  <hr className="hrformgroupcvtemplete" />
                  <label className="formlabelcvtemplete">Full Name:</label>
                  <input
                    className="forminputfieldcvtemplete"
                    type="text"
                    value={profile.title.name}
                    onChange={(e) => handleChange(e, "name", "title")}
                  />
                </div>

                <div className="form-groupcvtemplete">
                  <label className="formlabelcvtemplete">Designation:</label>
                  <input
                    className="forminputfieldcvtemplete"
                    type="text"
                    value={profile.title.designation}
                    onChange={(e) => handleChange(e, "designation", "title")}
                  />
                </div>

                <div className="form-groupcvtemplete">
                  <label className="formlabelcvtemplete">Phone:</label>
                  <input
                    className="forminputfieldcvtemplete"
                    type="tel"
                    value={profile.contact.phone}
                    onChange={(e) => handleChange(e, "phone", "contact")}
                  />
                </div>

                <div className="form-groupcvtemplete">
                  <label className="formlabelcvtemplete">Email:</label>
                  <input
                    className="forminputfieldcvtemplete"
                    type="email"
                    value={profile.contact.email}
                    onChange={(e) => handleChange(e, "email", "contact")}
                  />
                </div>

                <div className="form-groupcvtemplete">
                  <label className="formlabelcvtemplete">Address:</label>
                  <input
                    className="forminputfieldcvtemplete"
                    type="text"
                    value={profile.contact.address}
                    onChange={(e) => handleChange(e, "address", "contact")}
                  />
                </div>

                {/* Professional Summary (About Me) */}
                <div className="form-groupcvtemplete">
                  <p className="titlescvtemplete">
                    {profile.sectionTitles.aboutMe}
                  </p>
                  <hr className="hrformgroupcvtemplete" />
                  <textarea
                    className="formgrouptextarea"
                    value={profile.summary.aboutMe}
                    onChange={(e) => handleChange(e, "aboutMe", "summary")}
                  />
                </div>

                {/* Skills */}
                <div className="form-groupcvtemplete">
                  <p className="titlescvtemplete">
                    {profile.sectionTitles.skills}
                  </p>
                  <hr className="hrformgroupcvtemplete" />
                  <label className="formlabelcvtemplete">
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
                  <label className="formlabelcvtemplete">
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
                  <p className="titlescvtemplete">
                    {profile.sectionTitles.experience}
                  </p>
                  <hr className="hrformgroupcvtemplete" />
                  {/* Loop through each experience entry */}
                  {profile.experience.map((exp, index) => (
                    <div key={index}>
                      <div>
                        <label className="formlabelcvtemplete">
                          Job Title:
                        </label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={exp.title}
                          onChange={(e) =>
                            handleChange(e, "title", "experience", index)
                          }
                        />
                      </div>

                      <div>
                        <label className="formlabelcvtemplete">Company:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleChange(e, "company", "experience", index)
                          }
                        />
                      </div>

                      <div>
                        <label className="formlabelcvtemplete">Dates:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={exp.dates}
                          onChange={(e) =>
                            handleChange(e, "dates", "experience", index)
                          }
                        />
                      </div>

                      <div>
                        <label className="formlabelcvtemplete">
                          Description:
                        </label>
                        <textarea
                          className="formgrouptextarea"
                          value={exp.description.join("\n")} // Join array items by newlines
                          onChange={(e) =>
                            handleChange(e, "description", "experience", index)
                          } // Call handleChange
                        />
                      </div>

                      {/* Remove Experience Button */}
                      <button
                        className="Forminsidebuttons"
                        type="button"
                        onClick={() => removeExperience(index)}
                      >
                        Remove Experience
                      </button>
                    </div>
                  ))}

                  {/* Add Experience Button */}
                  <button
                    className="Forminsidebuttons"
                    type="button"
                    onClick={addExperience}
                  >
                    Add Experience
                  </button>
                </div>

                {/* Education */}
                <div className="form-groupcvtemplete">
                  <p className="titlescvtemplete">
                    {profile.sectionTitles.education}
                  </p>
                  <hr className="hrformgroupcvtemplete" />
                  {profile.education.map((edu, index) => (
                    <div key={index}>
                      <label className="formlabelcvtemplete">
                        College/School:
                      </label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={edu.college}
                        onChange={(e) =>
                          handleChange(e, "college", "education", index)
                        }
                      />

                      <label className="formlabelcvtemplete">Course:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={edu.course}
                        onChange={(e) =>
                          handleChange(e, "course", "education", index)
                        }
                      />

                      <label className="formlabelcvtemplete">Dates:</label>
                      <input
                        className="forminputfieldcvtemplete"
                        type="text"
                        value={edu.dates}
                        onChange={(e) =>
                          handleChange(e, "dates", "education", index)
                        }
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
                    onBlur={(e) =>
                      handleChange(e, "certifications", "sectionTitles")
                    }
                  >
                    {profile.sectionTitles.certifications}
                  </p>
                  <hr className="hrformgroupcvtemplete" />

                  {/* Loop through each certification entry */}
                  {profile.certifications.map((certification, index) => (
                    <div key={index} className="experience-itemcvtemplete">
                      {/* Editable Certification Title and Dates */}
                      <div>
                        <label className="formlabelcvtemplete">Title:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={certification.title}
                          onChange={(e) =>
                            handleChange(e, "title", "certifications", index)
                          }
                        />
                      </div>

                      <div>
                        <label className="formlabelcvtemplete">Dates:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={certification.dates}
                          onChange={(e) =>
                            handleChange(e, "dates", "certifications", index)
                          }
                        />
                      </div>

                      {/* Editable Description List */}
                      <div>
                        <label className="formlabelcvtemplete">
                          Description:
                        </label>
                        <textarea
                          className="formgrouptextarea"
                          value={certification.description.join("\n")} // Join all description points with a newline
                          onChange={(e) =>
                            handleChange(
                              e,
                              "description",
                              "certifications",
                              index,
                              e.target.value
                            )
                          }
                        />
                      </div>

                      {/* Add Description Button */}
                      <button
                        className="Forminsidebuttons"
                        type="button"
                        onClick={() => {
                          const updatedCertifications = [
                            ...profile.certifications,
                          ];
                          updatedCertifications[index].description.push(""); // Add empty description field
                          setProfile({
                            ...profile,
                            certifications: updatedCertifications,
                          });
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
                  <button
                    className="Forminsidebuttons"
                    type="button"
                    onClick={addCertification}
                  >
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
                    onBlur={(e) =>
                      handleChange(e, "certification", "sectionTitles")
                    }
                  >
                    {profile.sectionTitles.certification}
                  </p>
                  <hr className="hrformgroupcvtemplete" />

                  {/* Loop through each certification entry */}
                  {profile.certification.map((certification, index) => (
                    <div key={index} className="experience-itemcvtemplete">
                      {/* Editable Certification Title */}
                      <div>
                        <label className="formlabelcvtemplete">Title:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={certification.title}
                          onChange={(e) =>
                            handleChange(e, "title", "certification", index)
                          }
                        />
                      </div>

                      {/* Editable Dates */}
                      <div>
                        <label className="formlabelcvtemplete">Dates:</label>
                        <input
                          className="forminputfieldcvtemplete"
                          type="text"
                          value={certification.date}
                          onChange={(e) =>
                            handleChange(e, "date", "certification", index)
                          }
                        />
                      </div>

                      <div>
                        <label className="formlabelcvtemplete">
                          Description:
                        </label>
                        <textarea
                          className="formgrouptextarea"
                          value={certification.description.join("\n")} // Join description array with newlines
                          onChange={
                            (e) =>
                              handleChange(
                                e,
                                "description",
                                "certification",
                                index
                              ) // Handle description change
                          }
                        />
                      </div>

                      {/* Add Description Button */}
                      <button
                        className="Forminsidebuttons"
                        type="button"
                        onClick={() => {
                          const updatedCertifications = [
                            ...profile.certification,
                          ];
                          updatedCertifications[index].description.push(""); // Add empty description field
                          setProfile({
                            ...profile,
                            certification: updatedCertifications,
                          });
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
                  <button
                    className="Forminsidebuttons"
                    type="button"
                    onClick={addCertification}
                  >
                    Add Certification
                  </button>
                </div>

                {/* Personal Details Section */}
                <div className="form-groupcvtemplete">
                  <p className="titlescvtemplete">
                    {profile.sectionTitles.personalDetails}
                  </p>
                  <hr className="hrformgroupcvtemplete" />
                  <div>
                    <label className="formlabelcvtemplete">
                      Date of Birth:
                    </label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="date"
                      value={profile.personalDetails.dob}
                      onChange={(e) =>
                        handleChange(e, "dob", "personalDetails")
                      }
                    />
                  </div>

                  <div>
                    <label className="formlabelcvtemplete">Gender:</label>
                    <select
                      className="forminputfieldcvtemplete"
                      value={profile.personalDetails.gender}
                      onChange={(e) =>
                        handleChange(e, "gender", "personalDetails")
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="formlabelcvtemplete">
                      Marital Status:
                    </label>
                    <select
                      className="forminputfieldcvtemplete"
                      value={profile.personalDetails.maritalStatus}
                      onChange={(e) =>
                        handleChange(e, "maritalStatus", "personalDetails")
                      }
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="formlabelcvtemplete">Nationality:</label>
                    <input
                      className="forminputfieldcvtemplete"
                      type="text"
                      value={profile.personalDetails.nationality}
                      onChange={(e) =>
                        handleChange(e, "nationality", "personalDetails")
                      }
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
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
                <button onClick={onClose} className="resume-close-btn">
                  {" "}
                  &times;
                </button>
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
                          onBlur={(e) =>
                            handleChange(e, `experience-${index}-title`)
                          }
                        >
                          {exp.title}
                        </span>
                        at
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) =>
                            handleChange(e, `experience-${index}-company`)
                          }
                        >
                          {exp.company}
                        </span>
                        ({" "}
                        <span
                          className="editable-text"
                          contentEditable={true}
                          onBlur={(e) =>
                            handleChange(e, `experience-${index}-dates`)
                          }
                        >
                          {exp.dates}
                        </span>
                        )
                      </h3>

                      {/* Editable Description List */}
                      {exp.description &&
                      Array.isArray(exp.description) &&
                      exp.description.length > 0 ? (
                        <ul className="experience-descriptioncvtemplete">
                          {exp.description.map((point, idx) => (
                            <li
                              className="listinsertcvtemplete"
                              key={idx}
                              contentEditable={true}
                              onBlur={(e) =>
                                handleChange(
                                  e,
                                  `experience-${index}-description-${idx}`
                                )
                              }
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="cvtempletecertification">
                          No experience description available.
                        </p>
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
              {Array.isArray(profile.certifications) &&
              profile.certifications.length > 0 ? (
                profile.certifications.map((certification, index) => (
                  <div key={index} className="experience-itemcvtemplete">
                    {/* Editable Certification Title and Dates */}
                    <h3 className="experience-itemheadingcvtemplete">
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) =>
                          handleChange(e, `certification-${index}-title`)
                        }
                      >
                        {certification.title}
                      </span>
                      ({" "}
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) =>
                          handleChange(e, `certification-${index}-dates`)
                        }
                      >
                        {certification.dates}
                      </span>
                      )
                    </h3>

                    {/* Editable Description List */}
                    {Array.isArray(certification.description) &&
                    certification.description.length > 0 ? (
                      <ul className="experience-descriptioncvtemplete">
                        {certification.description.map((point, idx) => (
                          <li
                            className="listinsertcvtemplete"
                            key={idx}
                            contentEditable={true}
                            onBlur={(e) =>
                              handleChange(
                                e,
                                `certification-${index}-description-${idx}`
                              )
                            }
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
                <p className="cvtempletecertification">
                  No certifications available.
                </p> // If no certifications, show a fallback message
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
              {Array.isArray(profile.certification) &&
              profile.certification.length > 0 ? (
                profile.certification.map((certification, index) => (
                  <div key={index} className="experience-itemcvtemplete">
                    {/* Editable Certification Title and Date */}
                    <h3 className="experience-itemheadingcvtemplete">
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) =>
                          handleChange(e, `certification-${index}-title`)
                        }
                      >
                        {certification.title}
                      </span>
                      {" ("}
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) =>
                          handleChange(e, `certification-${index}-date`)
                        }
                      >
                        {certification.date}
                      </span>
                      {")"}
                    </h3>

                    {/* Editable Certification Description */}
                    {Array.isArray(certification.description) &&
                    certification.description.length > 0 ? (
                      <ul className="experience-descriptioncvtemplete">
                        {certification.description.map((point, idx) => (
                          <li
                            className="listinsertcvtemplete"
                            key={idx}
                            contentEditable={true}
                            onBlur={(e) =>
                              handleChange(
                                e,
                                `certification-${index}-description-${idx}`
                              )
                            }
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
                <p className="cvtempletecertification">
                  No certifications available.
                </p>
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
                        onBlur={(e) =>
                          handleChange(e, `education-${index}-course`)
                        }
                      >
                        {edu.course}
                      </span>
                      {" at "}
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) =>
                          handleChange(e, `education-${index}-college`)
                        }
                      >
                        {edu.college}
                      </span>
                      {" ("}
                      <span
                        className="editable-text"
                        contentEditable={true}
                        onBlur={(e) =>
                          handleChange(e, `education-${index}-dates`)
                        }
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
                    onBlur={(e) =>
                      handleChange(e, "personalDetails-maritalStatus")
                    }
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
                    onBlur={(e) =>
                      handleChange(e, "personalDetails-nationality")
                    }
                  >
                    {profile.personalDetails.nationality}
                  </span>
                </p>
              </div>
            </div>

            <div className="buttondivcvtemplete">
              {/* <button className="button"  id = "downloadButton">Download PDF</button> */}
              <button
                className="downloadendingbuttoncvtemplete"
                onClick={handlePrint}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  // const handleChange = (e, field) => {
  //   const updatedProfile = { ...profile };
  //   updatedProfile[field] = e.target.innerText;
  //   setProfile(updatedProfile);
  // };

  // return (
  //   <div>
  //     <button onClick={() => setIsEditing(!isEditing)}>
  //       {isEditing ? "View Profile" : "Edit Profile"}
  //     </button>
  //     {isEditing ? (
  //       <FormEdit profile={profile} handleChange={handleChange} />
  //     ) : (
  //       <Resume profile={profile} />
  //     )}
  //   </div>
  // );
  // };
}
export default CvTemplate;
