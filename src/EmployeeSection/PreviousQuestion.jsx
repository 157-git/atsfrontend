import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
// import './PreviousQuestion.css'
import companyLogo from '../LogoImages/logoweb2.png'


function PreviousQuestion() {
  const [companyName, setCompanyName] = useState("");
  const [jobName, setJobName] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);

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


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      companyName,
      jobName,
      questions
    };
    console.log("Form submitted:", formData);
    alert("Thank you! Your response has been recorded.");
    setCompanyName("");
    setJobName("");
    setQuestions([{ question: "", answer: "" }]);
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
          {/* Company Name */}
          <div>
            <label className="block font-semibold mb-1 text-black">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Job Name */}
          <div>
            <label className="block font-semibold mb-1 text-black">Job Title</label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Enter job title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
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
