import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import ResumeForm from "./ResumeFrom";
import ResumePreview from "./ResumePreview";
import "../ResumeData/printStyle.css";
// import './App.css';

const CandidateResumeLink = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    summary: "",
    experiences: [],
    projects: [{ title: "", description: "" }],
    educations: [{ institution: "", degree: "", startDate: "", endDate: "" }],
    technicalSkills: "",
    softSkills: "",
    // Akash pawar CandidateResumeLink 11/2024
    personalDetails: {
      dateOfBirth: "",
      gender: "",
      fatherName: "",
      married: "",
      spouseName: "",
      passportNumber: "",
      validTill: "",
      visaStatus: "",
    },
    profileImage: null,
    // Akash pawar CandidateResumeLink 11/2024
  });

  const previewRef = useRef();

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Resume Builder</h1>
      <div className="w-full flex flex-col md:flex-row justify-around">
        <div className="w-full md:w-1/2 px-2 mb-6 md:mb-0">
          <ResumeForm formData={formData} onChange={setFormData} />
        </div>
        <div className="w-full md:w-1/2 px-2">
          <ResumePreview ref={previewRef} data={formData} />
          {/* Akash pawar CandidateResumeLink 11/2024 */}

          <ReactToPrint
            trigger={() => (
              <button className="border mt-2 px-4 py-2 bg-[var(--button-color)] text-white rounded-[15px] hover:bg-[var(--hover-effect)] text-[var(--text-color)] hover:text-[var(--text-color)] transition-all duration-300">
                Download as PDF
              </button>
            )}
            content={() => previewRef.current}
            pageStyle={`@media print { @page { margin: 1mm; } body { margin: 0mm; } }`}
          />
          {/* Akash pawar CandidateResumeLink 11/2024 */}
        </div>
      </div>
    </div>
  );
};

export default CandidateResumeLink;
