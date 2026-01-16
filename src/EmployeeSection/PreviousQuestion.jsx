//Component created by Sakshi
import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
// import './PreviousQuestion.css'
import companyLogo from '../LogoImages/logoweb2.png'
import axios from 'axios';
import { fileToBase64converter } from '../HandlerFunctions/fileToBase64converter';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { API_BASE_URL } from '../api/api';
import { toast } from 'react-toastify';


function PreviousQuestion() {

  const [companyName, setCompanyName] = useState("");
  const [interviewRound, setInterviewRound] = useState("");
  const [questionAttachment, setQuestionAttachment] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [jobIdOptions, setJobIdOptions] = useState([]);
  const [designation, setDesignation] = useState("");
  const [designationOptions, setDesignationOptions] = useState([]);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [jobId, setJobId] = useState("");


  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    setCompanyName(selectedCompany);

    // Filter designations for this company (unique only)
    const filtered = [
      ...new Set(
        jobIdOptions
          .filter((item) => item.companyName === selectedCompany)
          .map((item) => item.designation)
      ),
    ];

    setDesignationOptions(filtered);
    setDesignation("");
    setJobId(""); // reset jobId until designation is chosen
  };

  const handleDesignationChange = (e) => {
    const selectedDesignation = e.target.value;
    setDesignation(selectedDesignation);

    // Find one job for this company + designation
    const matchingJob = jobIdOptions.find(
      (item) =>
        item.companyName === companyName &&
        item.designation === selectedDesignation
    );

    if (matchingJob) {
      setJobId(matchingJob.requirementId); // pick any one jobId
    }
  };


  const handleViewAttachment = (attachmentBase64String) => {
    if (attachmentBase64String) {
      setOpenAttachmentModal(true);
      const newBase64Attachment = `data:application/pdf;base64,${attachmentBase64String}`;
      setAttachmentUrl(newBase64Attachment);
    } else {
      setOpenAttachmentModal(false);
    }
  };

  const handleOk = () => {
    setOpenAttachmentModal(false);
  };
  const handleCancel = () => {
    setOpenAttachmentModal(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64String = await fileToBase64converter(file);

        setQuestionAttachment(base64String);
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };

  const fetchJobIds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-details`);
      const { data } = response;
      setJobIdOptions(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };

  useEffect(() => {
    fetchJobIds();
  }, []);

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };
  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const questionAddedDate = new Date().toISOString().split("T")[0];

    const dataToSubmit = {
      questionAddedDate,
      interviewRound,
      questionAttachment,
      interviewQuestion: questions.map((q) => ({
        interviewQuestions: q.question,
        answer: q.answer,   // send answer instead of unused 'reference'
      })),
    };


    console.log("Submitted Data:", JSON.stringify(dataToSubmit, null, 2));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/add-interview-details/${jobId}`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data);

      // Clearing form fields after successful submission
      setJobId("");
      setCompanyName("");
      setDesignation("");
      setInterviewRound("");
      setInterviewQuestions([]);
      setQuestions([{ question: "", answer: "" }]);
      setQuestionAttachment(null);
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className=" shadow-lg rounded-lg p-6 w-full max-w-2xl" style={{ backgroundColor: "#a7b8d4" }}>
        <div className="flex items-center justify-center gap-3 mb-6">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="h-16 object-contain"
          />
          <span className="text-2xl font-bold text-gray-800">
            157 Careers
          </span>
        </div>



        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Interview Experience Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name Dropdown */}
          <div>
            <label className="block font-semibold mb-1 text-black">Company Name</label>
            <select
              value={companyName}
              onChange={handleCompanyChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Company</option>
              {[...new Set(jobIdOptions.map((item) => item.companyName))].map(
                (uniqueName, index) => (
                  <option key={index} value={uniqueName}>
                    {uniqueName}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Designation Dropdown */}
          <div>
            <label className="block font-semibold mb-1 text-black">Designation</label>
            <select
              value={designation}
              onChange={handleDesignationChange}
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none ${!companyName ? "bg-gray-200 cursor-not-allowed" : ""}`}
              required
              disabled={!companyName}
            >
              <option value="">Select Designation</option>
              {designationOptions.map((desig, index) => (
                <option key={index} value={desig}>
                  {desig}
                </option>
              ))}
            </select>

          </div>

          <div>
            <label className="block font-semibold mb-1 text-black">Attachment:</label>

            <div className="flex items-center gap-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="newinputforinterviewquestions"
              />

              <button
                type="button"
                onClick={() => handleViewAttachment(questionAttachment)}
                className="p-1 text-gray-600 hover:text-blue-600"
              >
                {questionAttachment !== null ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </button>
            </div>
            {openAttachmentModal && (
              <Modal
                title="Attachment"
                open={openAttachmentModal}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
              >
                <iframe
                  src={attachmentUrl}
                  title="Questions"
                  style={{ width: "100%", height: "500px" }}
                ></iframe>
              </Modal>
            )}
          </div>

          {/* Dynamic Questions */}
          {questions.map((q, index) => (
            <div
              key={index}
              className="relative border border-gray-200 p-4 rounded-lg bg-gray-50"
            >
              {questions.length > 1 && index > 0 && (
                <button
                  type="button"
                  onClick={() => deleteQuestion(index)}
                  className="absolute top-2 right-2 bg-gray-200 text-gray-700 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-300 transition"    >
                  ✕
                </button>
              )}
              <div className="mb-3">
                <label className="block font-semibold mb-1">
                  Question {index + 1}
                </label>
                <textarea
                  name="question"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder="Enter interview question"
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-1">Answer</label>
                <textarea
                  name="answer"
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(index, e)}
                  placeholder="Enter your answer"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                ></textarea>
              </div>
            </div>
          ))}

          {/* Add Question Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={addQuestion}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Add Another Question
            </button>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              style={{ backgroundColor: "#526d82" }}
              className="text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PreviousQuestion
