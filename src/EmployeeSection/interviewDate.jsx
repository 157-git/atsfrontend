import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./interviewDate.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "../EmployeeSection/interviewDate.css";
import { API_BASE_URL } from "../api/api";
import Loader from "./loader";

const InterviewDates = ({ toggleShowShortListedCandidateData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [interviewData, setInterviewData] = useState(null);
  const [interviewDates, setInterviewDates] = useState([]);
  const [showAllData, setShowAllData] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [interviewResponses, setInterviewResponses] = useState([]);
  const [showShortlistTable, setShowShortlistTable] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [candidateId, setCandidateId] = useState("");
  const [requirementId, setRequirementId] = useState("");
  const [loading, setLoading] = useState(false);

  const { employeeId, userType } = useParams();
  const employeeIdNew = parseInt(employeeId, 10);

  useEffect(() => {
    fetchInterviewDates();
  }, []);

  const fetchAndUpdateInterviewResponse = async (
    candidateId,
    requirementId
  ) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/interview-response/${candidateId}/${employeeIdNew}/${requirementId}`
      );

      const data = await response.json();
      if (Array.isArray(data)) {
        setInterviewResponses(data);
      } else {
        console.error("Invalid data received:", data);
        setInterviewResponses([]);
      }
    } catch (error) {
      console.error("Error fetching interview response:", error);
      setInterviewResponses([]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  //  Fetch Interview Dates
  const fetchInterviewDates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/interview-date/${employeeIdNew}/${userType}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch interview dates");
      }
      const data = await response.json();
      if (data.length === 0) {
        toast.info("No interview dates available.");
        setInterviewDates(null);
      } else {
        setInterviewDates(data);
      }
    } catch (error) {
      // toast.error(`Error jjj fetching interview dates: ${error.message}`);
      console.error("Error fetching interview dates:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  //Handle Date Change
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    if (!date) {
      return;
    }

    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() + 10);
    const formattedDate = adjustedDate.toISOString().split("T")[0];
    console.log("Selected date:", formattedDate);

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/today-interview/${formattedDate}/${employeeId}/${userType}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data for the selected date");
      }

      const result = await response.json();
      if (result.data && result.data.length === 0) {
        toast.info("No Interviews Have Been Scheduled For This Date");
        setNoDataMessage(true);
        setInterviewData(null);
      } else {
        setInterviewData(result.data);
        setNoDataMessage(false);
      }

      setShowAllData(false);
    } catch (error) {
      toast.error(
        `Error fetching data for the selected date: ${error.message}`
      );
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Month Change
  const handleMonthChange = async (activeStartDate) => {
    if (activeStartDate) {
      const month = activeStartDate.getMonth() + 1;
      const year = activeStartDate.getFullYear();
      const monthString = `${year}-${month.toString().padStart(2, "0")}`;
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/fetch-by-month/${userType}?id=${employeeIdNew}&month=${monthString}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data for the selected month");
        }
        const data = await response.json();
        if (data.length === 0) {
          toast.info("No Interviews Have Been Scheduled In This Month");
          setNoDataMessage(true);
          setInterviewData(null);
        } else {
          setInterviewData(data);
          setNoDataMessage(false);
        }
        setShowAllData(true);
      } catch (error) {
        toast.error(
          `Error fetching data for the selected month: ${error.message}`
        );
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInterviewResponseSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const interviewRound = event.target.querySelector(
      'select[name="interviewRound"]'
    ).value;
    const interviewResponse = event.target.querySelector(
      'select[name="interviewResponse"]'
    ).value;
    const responseUpdatedDate = event.target.querySelector(
      'input[name="responseUpdatedDate"]'
    ).value;
    const nextInterviewDate = event.target.querySelector(
      'input[name="nextInterviewDate"]'
    ).value;
    const nextInterviewTiming = event.target.querySelector(
      'input[name="nextInterviewTiming"]'
    ).value;

    const data = {
      interviewRound,
      interviewResponse,
      responseUpdatedDate,
      nextInterviewDate,
      nextInterviewTiming,
      callingTracker: {
        candidateId,
      },
      requirementInfo: {
        requirementId,
      },
      employee: {
        employeeId: employeeIdNew,
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/save-interview-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setFormSubmitted(true);
        toast.success("Interview response saved successfully");
        setTimeout(() => {
          setFormSubmitted(false);
          setShowShortlistTable(false);
        }, 2000);
      } else {
        toast.error("Failed to save interview response:", response.statusText);
      }
    } catch (error) {
      toast.error("Error saving interview response:", error);
    }
    setLoading(false);
  };

  const handleFeedbackChange = async (candidateId, event) => {
    const feedback = event.target.value;
    await handleDateChange(selectedDate);
  };

  const renderInterviewTable = () => {
    if (!interviewData) {
      return (
        <h3 style={{ color: "#ffb281", marginTop: "20px" }}>
          No data available for the selected date.
        </h3>
      );
    }

    const handleMouseOver = (event) => {
      const tableData = event.currentTarget;
      const tooltip = tableData.querySelector(".tooltip");
      const tooltiptext = tableData.querySelector(".tooltiptext");

      if (tooltip && tooltiptext) {
        const textOverflowing =
          tableData.offsetWidth < tableData.scrollWidth ||
          tableData.offsetHeight < tableData.scrollHeight;
        if (textOverflowing) {
          const rect = tableData.getBoundingClientRect();
          tooltip.style.top = `${rect.top - 10}px`;
          tooltip.style.left = `${rect.left + rect.width / 100}px`;
          tooltip.style.visibility = "visible";
        } else {
          tooltip.style.visibility = "hidden";
        }
      }
    };

    const handleMouseOut = (event) => {
      const tooltip = event.currentTarget.querySelector(".tooltip");
      if (tooltip) {
        tooltip.style.visibility = "hidden";
      }
    };

    const handleRowClick = async (candidateId, requirementId) => {
      console.log("01 requirementId " + requirementId);
      setCandidateId(candidateId);
      setRequirementId(requirementId);

      await fetchAndUpdateInterviewResponse(candidateId, requirementId);
      setShowShortlistTable(true);
    };

    return (
      <div className="App-after">
        {loading ? (
          <div className="register">
            <Loader></Loader>
          </div>
        ) : (
          <>
            <div className="interview-data-div">
              <table id="shortlisted-table-id" className="attendance-table">
                <thead>
                  <tr className="attendancerows-head">
                    <th className="attendanceheading">Sr No</th>
                    <th className="attendanceheading">Candidate Id</th>
                    <th className="attendanceheading">Added Date Time </th>
                    <th className="attendanceheading">Interview Date</th>
                    <th className="attendanceheading">Interview Time </th>
                    <th className="attendanceheading">Attending Status </th>
                    <th className="attendanceheading">Candidate Name</th>
                    <th className="attendanceheading">Candidate Email</th>
                    <th className="attendanceheading">Job Id</th>
                    <th className="attendanceheading">Applying Position</th>
                    <th className="attendanceheading">Applying Compnay</th>
                    <th className="attendanceheading">Contact Number</th>
                    <th className="attendanceheading">Current Location</th>
                    <th className="attendanceheading">Current Company</th>
                    <th className="attendanceheading">Total Experience</th>
                    <th className="attendanceheading">Current CTC</th>
                    <th className="attendanceheading">Expected CTC</th>
                    <th className="attendanceheading">Notice Period</th>
                    <th className="attendanceheading">Any Offer Letter</th>
                    <th className="attendanceheading">Resume</th>
                    <th className="attendanceheading">Incentive</th>
                    <th className="attendanceheading">Interview Status</th>
                    <th className="attendanceheading">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewData.map((item, index) => (
                    <tr
                      key={item.candidateId}
                      className={
                        item.candidateId === candidateId
                          ? "highlighted-row"
                          : "attendancerows"
                      }
                      onClick={() =>
                        handleRowClick(item.candidateId, item.requirementId)
                      }
                    >
                      <td className="tabledata">{index + 1}</td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.candidateId}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.candidateId}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.date} - {item.candidateAddedTime || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.date} - {item.candidateAddedTime}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.availabilityForInterview || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.availabilityForInterview}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.interviewTime || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.interviewTime}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.token || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.token}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.candidateName}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.candidateName}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.candidateEmail || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.candidateEmail}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.requirementId || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.requirementId}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.jobDesignation || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.jobDesignation}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.requirementCompany || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.requirementCompany}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.contactNumber || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.contactNumber}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.currentLocation || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.currentLocation}
                          </span>
                        </div>
                      </td>
                      {/* {item.lineUp && ( */}
                      <>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.companyName || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.companyName}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.experienceYear || "0"} Years{" "}
                          {item.experienceMonth || "0"} Months
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.experienceYear || "0"} Years{" "}
                              {item.experienceMonth || "0"} Months
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.currentCTCLakh} Lakh {item.currentCTCThousand}{" "}
                          Thousand
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.currentCTCLakh} Lakh{" "}
                              {item.currentCTCThousand} Thousand
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.expectedCTCLakh} Lakh {item.expectedCTCThousand}{" "}
                          Thousand
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.expectedCTCLakh} Lakh{" "}
                              {item.expectedCTCThousand} Thousand
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.noticePeriod || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.noticePeriod}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.holdingAnyOffer || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.holdingAnyOffer}
                            </span>
                          </div>
                        </td>
                        {/* <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {item.lineUp.resume || "-"}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {item.lineUp.resume}
                          </span>
                        </div>
                      </td> */}

                        {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeViewButton(added) start LineNo:-546
                  Date:-02/07 */}
                        <td className="tabledata">
                          <button
                            className="table-icon-div"
                            onClick={() => openResumeModal(item.resume)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                        {/* Name:-Akash Pawar Component:-ShortListedCandidate
                  Subcategory:-ResumeViewButton(added) End LineNo:-558
                  Date:-02/07 */}
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.incentive || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.incentive}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.finalStatus || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.finalStatus}
                            </span>
                          </div>
                        </td>
                        <td className="tabledata">
                          <button className="table-icon-div">
                            <i
                              onClick={() => {
                                fetchAndUpdateInterviewResponse(
                                  item.candidateId,
                                  item.requirementId
                                );
                                setShowShortlistTable(!showShortlistTable);
                              }}
                              className="fa-regular fa-pen-to-square"
                            ></i>
                          </button>
                        </td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const tempdate = new Date(date);
      tempdate.setHours(tempdate.getHours() + 10);
      const formattedDate = tempdate.toISOString().split("T")[0];
      const isInterviewDate = interviewDates.includes(formattedDate);
      return isInterviewDate && <div className="highlighted-date"></div>;
    }
  };

  //Name:-Akash Pawar Component:-InterviewDate Subcategory:-ResumeViewButton(added) start LineNo:-240 Date:-02/07
  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        // Detect file type based on file name extension or content
        const fileType = fileName.split(".").pop().toLowerCase();

        // Convert PDF
        if (fileType === "pdf") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "application/pdf" });
          return URL.createObjectURL(blob);
        }

        // Convert Word document (assuming docx format)
        if (fileType === "docx") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });
          return URL.createObjectURL(blob);
        }

        // Handle other document types here if needed

        // If file type is not supported
        console.error(`Unsupported document type: ${fileType}`);
        return "Unsupported Document";
      } catch (error) {
        console.error("Error converting byte code to document:", error);
        return "Invalid Document";
      }
    }
    return "Document Not Found";
  };
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
  };
  //Name:-Akash Pawar Component:-ShortListedCandidate Subcategory:-ResumeViewButton(added) End LineNo:-271 Date:-02/07

  return (
    <div className="calendar-container">
      <div className="calender-main-div">
        <div className="calendar">
          <div className="calendar-div">
            <Calendar
              value={selectedDate}
              onChange={handleDateChange}
              onActiveStartDateChange={({ activeStartDate, view }) =>
                view === "month" && handleMonthChange(activeStartDate)
              }
              tileContent={tileContent}
            />
          </div>
          {loading ? (
            <div className="register">
              <Loader></Loader>
            </div>
          ) : (
            <>
              {showShortlistTable && (
                <div className="shortlist-table-div">
                  <div className="interview-response-update">
                    {/* <h6>Response Update-Candidate Name</h6> */}
                  </div>
                  <form onSubmit={handleInterviewResponseSubmit}>
                    <table
                      id="table-shortlisted"
                      className="table table-bordered"
                    >
                      <thead className="thead-dark">
                        <tr>
                          <th>No</th>
                          <th>Interview Round</th>
                          <th>Interview Response</th>
                          <th>Comment for TL</th>
                          <th>Update Date</th>
                          <th>Next Interview Date</th>
                          <th>Interview Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {interviewResponses.map((response, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{response.interviewRound}</td>
                            <td>{response.interviewResponse}</td>
                            <td></td>
                            <td>{response.responseUpdatedDate}</td>
                            <td>{response.nextInterviewDate}</td>
                            <td>{response.nextInterviewTiming}</td>
                          </tr>
                        ))}
                        <tr>
                          <td></td>

                          <td>
                            <select name="interviewRound" required>
                              <option value="">Select Interview</option>
                              <option value="Hr Round">Hr Round</option>
                              <option value="Technical Round">
                                Technical Round
                              </option>
                              <option value="L1 Round"> L1 Round</option>
                              <option value="L2 Round"> L2 Round</option>
                              <option value="L3 Round"> L3 Round</option>
                            </select>
                          </td>
                          <td>
                            <select name="interviewResponse" required>
                              <option value="">Update Response</option>
                              <option value="Shortlisted For Hr Round">
                                Shortlisted For Hr Round
                              </option>
                              <option value="Shortlisted For Technical Round">
                                Shortlisted For Technical Round
                              </option>
                              <option value="Shortlisted For L1 Round">
                                Shortlisted For L1 Round
                              </option>
                              <option value="Shortlisted For L2 Round">
                                Shortlisted For L2 Round
                              </option>
                              <option value="Shortlisted For L3 Round">
                                Shortlisted For L3 Round
                              </option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Hold">Hold</option>
                              <option value="Result Pending">
                                Result Pending
                              </option>
                              <option value="No Show">No Show</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="text"
                              placeholder="Enter Comment here... "
                              name=""
                              id=""
                            />
                          </td>
                          <td>
                            <input type="date" name="responseUpdatedDate" />
                          </td>
                          <td>
                            <input type="date" name="nextInterviewDate" />
                          </td>
                          <td>
                            <input type="time" name="nextInterviewTiming" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {/* {formSubmitted && (
                      <div className="alert alert-success" role="alert">
                        Interview Response Updated Successfully!
                      </div>
                    )} */}
                    <div className="shortlisted-submite-btn">
                      <button type="submit">Update</button>
                      <button onClick={() => setShowShortlistTable(false)}>
                        Close
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!showAllData && interviewData && (
        <div className="interview-table">{renderInterviewTable()}</div>
      )}
      {showAllData && (
        <div className="interview-table">{renderInterviewTable()}</div>
      )}
      {!showAllData && noDataMessage && (
        <h3 style={{ color: "#ffb281", marginTop: "20px" }}>
          No interviews scheduled on this date.
        </h3>
      )}
      {/* Name:-Akash Pawar Component:-InterviewDate
          Subcategory:-ResumeModel(added) End LineNo:-599 Date:-02/07 */}
      <Modal show={showResumeModal} onHide={closeResumeModal} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCandidateResume ? (
            <iframe
              src={convertToDocumentLink(selectedCandidateResume, "Resume.pdf")}
              width="100%"
              height="550px"
              title="PDF Viewer"
            ></iframe>
          ) : (
            <p>No resume available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeResumeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Name:-Akash Pawar Component:-InterviewDate
          Subcategory:-ResumeModel(added) End LineNo:-624 Date:-02/07 */}
    </div>
  );
};

export default InterviewDates;
