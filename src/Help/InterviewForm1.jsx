import { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import "../Help/InterviewForm1.css";
import { API_BASE_URL } from "../api/api";
import { fileToBase64converter } from "../HandlerFunctions/fileToBase64converter";
import { message } from "antd";

const InterviewForm1 = ({ toggleAllInterviewResponse }) => {
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
  const [indexRequirment, setindexRequirment] = useState("");

  const handleJobChange = (e) => {
    const index = e.target.value;
    setJobId(requirementOptions[index].requirementId);

    setCompanyName(requirementOptions[index].companyName);
    setDesignation(requirementOptions[index].designation);
    setindexRequirment(index);
  };

  const handleAddQuestion = () => {
    if (question.trim() && reference.trim()) {
      setInterviewQuestions([...interviewQuestions, { question, reference }]);
      setQuestionsList([...questionsList, { question, reference }]);
      setQuestion("");
      setReference("");
    } else {
      alert("Please enter both question and reference.");
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

      message.success(response.data);

      // Corrected state update
      setSubmittedData((prev) => [...prev, dataToSubmit]);

      // Clearing form fields after successful submission
      setindexRequirment("");
      setCompanyName("");
      setDesignation("");
      setInterviewRound("");
      setQuestionAttachment("");
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

  return (
    <div className="container newcontainerclassforinterviewform">
      {/* <h2 className="title newclassfortitleform">Interview Details</h2> */}
      <div className="form-row">
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Requirement Id:</label>
          <select
            value={indexRequirment}
            onChange={handleJobChange}
            className="newinputforinterviewquestions"
          >
            <option value="">Select Requirement ID</option>
            {requirementOptions.map((item, index) => (
              <option key={index} value={index}>
                {item.companyName}
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
          <label>Interview Round:</label>
          <select
            value={interviewRound}
            onChange={(e) => setInterviewRound(e.target.value)}
            className="newinputforinterviewquestions"
          >
            <option value="">Select Round</option>
            <option value="Round 1">HR Round</option>
            <option value="Round 2">Technical Round</option>
            <option value="Round 3">L1 Round</option>
            <option value="Round 4">L2 Round</option>
            <option value="Final Round">L3 Round</option>
          </select>
        </div>
        <div className="form-group small newformgroupforinterviewquestionsform">
          <label>Attachment:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="newinputforinterviewquestions"
          />
          {questionAttachment && <span>{questionAttachment.name}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width textarea-container">
          <label>Questions:</label>
          <div className="textarea-wrapper">
            <textarea value="" className="question-details-textarea" readOnly />
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
        <div className="table-container">
          <hr />
          <h2 className="theading">Interview Questions</h2>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Interview Round</th>
                <th>Question</th>
                <th>Reference</th>
                <th>Attachment</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) =>
                data.interviewQuestion.map((q, qIndex) => (
                  <tr key={`${index}-${qIndex}`}>
                    {qIndex === 0 && (
                      <>
                        <td rowSpan={data.interviewQuestion.length}>
                          {data.questionAddedDate}
                        </td>
                        <td rowSpan={data.interviewQuestion.length}>
                          {data.interviewRound}
                        </td>
                      </>
                    )}
                    <td>{q.interviewQuestions}</td>
                    <td>{q.questionsReference}</td>
                    {qIndex === 0 && (
                      <td rowSpan={data.interviewQuestion.length}>
                        {data.questionAddedDate}
                      </td>
                    )}
                    {/* {qIndex === 0 && (
                      <td rowSpan={data.interviewQuestion.length}>
                        <button className="action-btn">
                          <CiEdit />
                        </button>
                        <button className="action-btn">
                          <RiDeleteBin6Line />
                        </button>
                      </td>
                    )} */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewForm1;
