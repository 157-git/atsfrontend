import { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../Help/InterviewForm1.css";
import { API_BASE_URL } from "../api/api";
import { fileToBase64converter } from "../HandlerFunctions/fileToBase64converter";
import { toast } from "react-toastify";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Link } from "react-router-dom";

const InterviewForm1 = ({ toggleAllInterviewResponse }) => {
    // const API_BASE_URL = 'https://rg.157careers.in/api/ats/157industries';

  const [jobId, setJobId] = useState("");
  const [designation, setDesignation] = useState("");
  const [fileName, setFileName] = useState("");

  const [interviewReference, setInterviewReference] = useState("");
  const [interviewQuestionsList, setInterviewQuestionsList] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [interviewRound, setInterviewRound] = useState("");
  const [questionAddedDate, setQuestionAddedDate] = useState("");
  const [questionAttachment, setQuestionAttachment] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [submittedData, setSubmittedData] = useState([]);
  const [reference, setReference] = useState("");
  const [question, setQuestion] = useState("");
  const [questionsList, setQuestionsList] = useState([]);

  const requirementData = {
    "REQ-101": { companyName: "ABC Corp", designation: "Software Engineer" },
    "REQ-102": { companyName: "XYZ Pvt Ltd", designation: "Backend Developer" },
    "REQ-103": { companyName: "TechSoft", designation: "Frontend Developer" },
  };
  const [indexRequirment, setindexRequirment] = useState("");
  const handleJobChange = (e) => {
    const index = e.target.value;
    setJobId(requirementOptions[index].requirementId);

    setCompanyName(requirementOptions[index].companyName);
    setDesignation(requirementOptions[index].designation);
    setindexRequirment(index);
  };

  const handleAddQuestion = () => {
    if (question.trim()) {
      setInterviewQuestions([...interviewQuestions, { question, reference }]);
      setQuestionsList([...questionsList, { question, reference }]);
      setQuestion("");
      setReference("");
    } else {
      toast.info("Question is required !");
    }
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

  const convertFileToByteArray = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const byteArray = new Uint8Array(arrayBuffer);
        resolve([...byteArray]);
      };
      reader.onerror = (error) => reject(error);
    });
  };
  const [requirementOptions, setRequirementOptions] = useState([]);
  const fetchRequirementOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/company-details`);
      console.log("Response Data:-", response.data)
      const { data } = response;
      setRequirementOptions(data);
    } catch (error) {
      console.error("Error fetching requirement options:", error);
    }
  };
  useEffect(() => {
    fetchRequirementOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobId) {
      toast.error("Please Select Job ID");
      return;
    }
    if (!interviewRound) {
      toast.error("Please Select Interview Round");
      return;
    }
    if (questionsList.length === 0) {
      toast.info("At Least 1 Question Required !");
      return;
    }

    const questionAddedDate = new Date().toISOString().split("T")[0];

    const dataToSubmit = {
      questionAddedDate,
      interviewRound,
      questionAttachment, // Ensure this is properly handled if it's a file
      interviewQuestion: interviewQuestions.map((q) => ({
        interviewQuestions: q.question,
        questionsReference: q.reference,
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

      // Corrected state update
      setSubmittedData((prev) => [...prev, dataToSubmit]);

      // Clearing form fields after successful submission
      setJobId("");
      setindexRequirment("");
      setCompanyName("");
      setDesignation("");
      setInterviewRound("");
      setInterviewQuestions([]);
      setQuestionsList([]);
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

  console.log(submittedData);
  console.log(requirementOptions);
  const [openAttachmentModal, setOpenAttachmentModal] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  
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

  return (
    <div className="container newcontainerclassforinterviewform">
      <h2 className="title newclassfortitleform">Interview Details</h2>
      <div className="newClassForInterviewLink">
        <Link
          to="/previousQuestion"
          target="_blank"
          rel="noopener noreferrer"
        >
          Share Link
        </Link>
      </div>

      <div className="form-row">
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Job Id: <span className="setRequiredAstricColorRed">*</span></label>
          <select
            value={indexRequirment}
            onChange={handleJobChange}
            className="newinputforinterviewquestions"
          >
            <option value="">Select Job ID</option>
            {requirementOptions.map((item, index) => (
              <option key={index} value={index}>
                <strong>  {item.requirementId}</strong> : {item.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            readOnly
            className="newinputforinterviewquestions"
          />
        </div>
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Designation:</label>
          <input
            type="text"
            value={designation}
            readOnly
            className="newinputforinterviewquestions"
          />
        </div>
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Interview Round: <span className="setRequiredAstricColorRed">*</span></label>
          <select
            value={interviewRound}
            onChange={(e) => setInterviewRound(e.target.value)}
            className="newinputforinterviewquestions"
          >
            <option value="">Select Round</option>
            <option value="HR Round">HR Round</option>
            <option value="Technical Round">Technical Round</option>
            <option value="L1 Round">L1 Round</option>
            <option value="L2 Round">L2 Round</option>
            <option value="L3 Round">L3 Round</option>
          </select>
        </div>
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Attachment:</label>
          <input
            // value={questionAttachment ? "" : undefined}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="newinputforinterviewquestions"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width textarea-container">
          <label>Questions:</label>
          <div className="textarea-wrapper">
            <textarea value="" className="textareaNewForAlignment" readOnly />
          </div>
          <div className="newWrappedForQuestionsRef">
            <div className="form-group-Queations">
              <label>Question:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="newinputforinterviewquestions"
                placeholder="Enter Questions"
              />
            </div>
            <div className="form-group-reference">
              <label>Reference:</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="newinputforinterviewquestions"
                placeholder="Enter Reference"
              />
            </div>
            <button
              onClick={handleAddQuestion}
              className="add-btn1 lineUp-Filter-btn"
            >
              Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="wrappedlistinterviewform">
        <div className="questions-list">
          {questionsList.length > 0 && <h3>Questions</h3>}

          <ul>
            {questionsList.map((q, index) => (
              <li key={index} className="question-item">
                <span>
                  {index + 1}. {q.question}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="reference-list">
          {questionsList.length > 0 && <h3>References</h3>}
          <ul>
            {questionsList.map((q, index) => (
              <li key={index} className="reference-item">
                <span>
                  {index + 1}. {q.reference}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="submit-container">
        <button onClick={handleSubmit} className="submit-btn lineUp-Filter-btn">
          Submit
        </button>
      </div>

      {submittedData.length > 0 && (
        <div className="setNewWidth">
          <hr />
          <h2 className="theading1">Interview Questions</h2>
          <div>
            <table className="NEWCLASSFORTABLE">
              <thead>
                <tr className="newtableheadingrow">
                  <th className="newthclassforinterviewtable">Time</th>
                  <th className="newthclassforinterviewtable">
                    Interview Round
                  </th>
                  <th className="newthclassforinterviewtable">Question</th>
                  <th className="newthclassforinterviewtable">Reference</th>
                  <th className="newthclassforinterviewtable">Attachment</th>
                  {/* <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {submittedData.map((item, index) => (
                  <>
                    <tr className="newinterviewtablerow1">
                      <td className="newthclassforinterviewtable">
                        {item.questionAddedDate}
                      </td>
                      <td className="newthclassforinterviewtable">
                        {item.interviewRound}
                      </td>
                      <td className="newthclassforinterviewtable">
                        {item.interviewQuestion.map((ques, indexQues) => (
                          <div
                            className="classnamesetdisplayflexforinterviewtable"
                            style={{
                              borderBottom: `${indexQues !==
                                item.interviewQuestion.length - 1 &&
                                "1px solid black"
                                }`,
                            }}
                          >
                            <p className="setmarginclassfortableptag">
                              {indexQues + 1}{" "}
                            </p>
                            <p>
                              {" "}
                              {ques.interviewQuestions
                                ? ques.interviewQuestions
                                : " "}
                            </p>
                          </div>
                        ))}
                      </td>
                      <td className="newthclassforinterviewtable">
                        {item.interviewQuestion.map((ref, indexRef) => (
                          <div
                            className="classnamesetdisplayflexforinterviewtable"
                            style={{
                              borderBottom: `${indexRef !==
                                item.interviewQuestion.length - 1 &&
                                "1px solid black"
                                }`,
                            }}
                          >
                            <p className="setmarginclassfortableptag">
                              {indexRef + 1}{" "}
                            </p>
                            <p>
                              {ref.questionsReference
                                ? ref.questionsReference
                                : " "}
                            </p>
                          </div>
                        ))}
                      </td>
                      <td
                        className="newthclassforinterviewtable"
                        onClick={() =>
                          handleViewAttachment(item.questionAttachment)
                        }
                      >
                        {item.questionAttachment !== null ? (
                          <EyeOutlined />
                        ) : (
                          <EyeInvisibleOutlined />
                        )}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
  );
};

export default InterviewForm1;
