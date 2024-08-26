/* Mohini_13/07/2024_QuestionPaper_Whole_page */

import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./questionPaper.css";
import logo from "../LogoImages/157logo.jpeg"; // Update the path to your logo image file

const QuestionPaper = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Paris", "Berlin", "London", "Madrid"],
      selectedOption: "",
    },
    {
      id: 2,
      question: 'Who wrote "To Kill a Mockingbird"?',
      options: [
        "Harper Lee",
        "Jane Austen",
        "Charles Dickens",
        "F. Scott Fitzgerald",
      ],
      selectedOption: "",
    },
    {
      id: 3,
      question: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      selectedOption: "",
    },
    {
      id: 4,
      question: "Which planet is known as the Red Planet?",
      options: ["Mars", "Jupiter", "Venus", "Mercury"],
      selectedOption: "",
    },
    {
      id: 5,
      question: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Michelangelo",
      ],
      selectedOption: "",
    },
    {
      id: 6,
      question: "What is the currency of Japan?",
      options: ["Yuan", "Dollar", "Yen", "Euro"],
      selectedOption: "",
    },
    {
      id: 7,
      question: "Who discovered gravity?",
      options: [
        "Isaac Newton",
        "Albert Einstein",
        "Galileo Galilei",
        "Stephen Hawking",
      ],
      selectedOption: "",
    },
    {
      id: 8,
      question: "What is the capital of Italy?",
      options: ["Rome", "Madrid", "Berlin", "Lisbon"],
      selectedOption: "",
    },
    {
      id: 9,
      question: 'Who wrote the play "Hamlet"?',
      options: [
        "William Shakespeare",
        "John Milton",
        "Jane Austen",
        "Charles Dickens",
      ],
      selectedOption: "",
    },
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const [pdfSrc, setPdfSrc] = useState(""); // State to store the URL of the generated PDF
  const [showPDF, setShowPDF] = useState(false); // State to control PDF visibility

  const iframeRef = useRef(null);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      selectedOption: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionChange = (questionId, value) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, question: value };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        const newOptions = [...question.options];
        newOptions[optionIndex] = value;
        return { ...question, options: newOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionSelect = (questionId, option) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        return { ...question, selectedOption: option };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleViewPDF = () => {
    generatePDF(); // Generate PDF immediately when clicked
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      hotfixes: [],
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;
    let y = 20; // Initial margin at the top

    // Draw logo and company details
    doc.addImage(logo, "JPEG", centerX - 15, y, 30, 30);
    y += 40;
    doc.setFontSize(16);
    doc.text("157 Industries Private Limited", centerX, y, { align: "center" });

    // Set the line width for the underline

    const lineWidth = 0.8; // Adjust this value for desired thickness
    doc.setLineWidth(lineWidth);

    // Draw the underline for "157 Industries Private Limited"
    const textWidth = doc.getTextWidth("157 Industries Private Limited");
    const underlineY = y + 2; // Adjust the vertical position of the underline as needed
    const underlineMargin = 5; // Adjust this value for the desired width
    doc.line(
      centerX - textWidth / 2 - underlineMargin,
      underlineY,
      centerX + textWidth / 2 + underlineMargin,
      underlineY
    );

    y += 10;
    doc.text("157 Careers", centerX, y, { align: "center" });

    // Draw the underline for "157 Careers"
    const careerTextWidth = doc.getTextWidth("157 Careers");
    const careerUnderlineY = y + 2; // Adjust the vertical position of the underline as needed
    doc.line(
      centerX - careerTextWidth / 2 - underlineMargin,
      careerUnderlineY,
      centerX + careerTextWidth / 2 + underlineMargin,
      careerUnderlineY
    );

    y += 10;
    doc.setFontSize(12);
    doc.text(
      "Recruitment | Development | Training | Anticlockwise Wrist Watches",
      centerX,
      y,
      { align: "center" }
    );
    y += 10;
    doc.text(
      "Office no 2, 2nd floor, Ace Nest Building, above cafe Milano 703, Taboot Street, Pune 411001",
      centerX,
      y,
      { align: "center" }
    );
    y += 10;
    // Add border to PDF page
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
    y += 1; // Adjust this value to add a small gap
    doc.setLineWidth(0.8);
    doc.line(10, y, pageWidth - 10, y);
    y += 1; // Adjust this value to add a small gap
    doc.setLineWidth(0.5);
    doc.line(10, y, pageWidth - 10, y);
    y += 10; // Ensure proper spacing after the lines

    // Add border to PDF page
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    y += 10; // Add margin before questions

    const leftColumnX = 15;
    const rightColumnX = centerX + 5;
    const columnWidth = pageWidth / 2 - 25;
    let leftColumnY = y;
    let rightColumnY = y;
    let isLeftColumn = true;

    const maxQuestionLength = 80; // Set a limit for question length

    questions.forEach((question, index) => {
      let x = isLeftColumn ? leftColumnX : rightColumnX;
      let currentY = isLeftColumn ? leftColumnY : rightColumnY;

      // Check if there's enough space for the question and options; if not, add a new page
      const spaceRequired = 15 + question.options.length * 8; // Adjusted space calculations
      const questionText = `Q${question.id}: ${question.question}`;
      const questionHeight = doc.getTextDimensions(questionText).h;
      const questionFitsOnCurrentPage =
        currentY + spaceRequired + questionHeight <= pageHeight - 20;

      if (!questionFitsOnCurrentPage) {
        doc.addPage();
        currentY = 20; // Margin at the top of new page
        // Add border to new page
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Reset column positions for the new page
        leftColumnY = currentY;
        rightColumnY = currentY;
        isLeftColumn = true; // Start with the left column on the new page
        x = leftColumnX;
      }

      doc.setFontSize(12);

      if (questionText.length > maxQuestionLength) {
        // If the question is too long, add it to the page as a single block
        doc.text(questionText, leftColumnX, currentY, {
          align: "left",
          maxWidth: pageWidth - 30,
        });
        currentY += 10; // Adjust spacing after the long question
      } else {
        // If the question is short, use the existing logic
        doc.text(questionText, x, currentY);
        currentY += 8; // Adjusted space between question and options
      }

      const optionsABCD = ["A", "B", "C", "D"];
      question.options.forEach((option, index) => {
        const optionY = currentY + index * 8; // Adjusted spacing between options
        doc.setFontSize(10);
        doc.text(`${optionsABCD[index]}:`, x + 5, optionY);
        doc.text(option, x + 15, optionY); // Adjust horizontal position for options
      });

      currentY += 4 + question.options.length * 8; // Adjusted space between questions

      if (isLeftColumn) {
        leftColumnY = currentY + 8; // Adjusted space between questions in the left column
      } else {
        rightColumnY = currentY + 8; // Adjusted space between questions in the right column
      }

      isLeftColumn = !isLeftColumn; // Switch columns
    });

    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfSrc(pdfUrl); // Set PDF URL after generation

    setShowPDF(true); // Show PDF iframe
  };

  const handleDownloadPDF = () => {
    const link = document.createElement("a");
    link.href = pdfSrc;
    link.download = "question_paper.pdf";
    link.click();
  };

  const handleCancelPDF = () => {
    setShowPDF(false); // Hide PDF iframe
  };

  return (
    <div className="question-container">
      <div className="question-paper-container">
        <div className="header-div">
          <header className="header">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="underline">157 Industries Private Limited</h1>
            <h2 className="underline">157 Careers</h2>
            <p>
              Recruitment | Development | Training | Anticlockwise Wrist Watches
            </p>
            <p>
              Office no 2, 2nd floor, Ace Nest Building, above cafe Milano 703,
              Taboot Street, Pune 411001
            </p>
          </header>
        </div>
        <div className="pdf-header">
          <div className="form-containers">
            <form className="question-paper">
              {questions.map((question) => (
                <div key={question.id} className="question">
                  <input
                    type="text"
                    value={question.question}
                    placeholder={`Enter question ${question.id}`}
                    onChange={(e) =>
                      handleQuestionChange(question.id, e.target.value)
                    }
                  />
                  {question.options.map((option, index) => (
                    <div key={index} className="option">
                      <input
                        type="radio"
                        name={`question${question.id}`}
                        checked={question.selectedOption === option}
                        value={option}
                        onChange={() => handleOptionSelect(question.id, option)}
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(question.id, index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
              <div className="buttons">
                <button type="button" onClick={handleAddQuestion}>
                  Add More
                </button>
                <button type="button" onClick={handleViewPDF}>
                  View
                </button>
              </div>
            </form>
          </div>
          {showPDF && (
            <div className="pdf-preview">
              <iframe
                ref={iframeRef}
                src={pdfSrc}
                width="100%"
                height="500px"
                title="PDF Preview"
              ></iframe>
              <div className="pdf-buttons">
                <button className="button" onClick={handleDownloadPDF}>
                  Download PDF
                </button>
                <button className="button" onClick={handleCancelPDF}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {showAlert && (
            <div className="alert">
              <p>Are you sure you want to generate the PDF?</p>
              <button onClick={generatePDF}>Yes</button>
              <button onClick={() => setShowAlert(false)}>No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionPaper;
