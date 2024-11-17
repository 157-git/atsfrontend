import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./EmployeeDetails.css";
import UpdateEmployee from "./UpdateEmployee";
import HashLoader from "react-spinners/HashLoader";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";

// SwapnilRokade_UpdateEmployee_fetchingData From DataBase_16/07
const EmployeeDetails = () => {
  const [employeeData, setEmployeeData] = useState([]);
  let [color, setColor] = useState("#ffcb9b");
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [blockedEmployees, setBlockedEmployees] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [employeeRole, setEmployeeRole] = useState("");
  const [showEmployee, setShowEmployee] = useState(false);
  const { employeeId, userType } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/employee-details/${employeeId}/${userType}`
        );
        setEmployeeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBlock = (employeeId) => {
    console.log(`Blocking employee with ID: ${employeeId}`);
    if (blockedEmployees.includes(employeeId)) {
      setBlockedEmployees(blockedEmployees.filter((id) => id !== employeeId));
    } else {
      setBlockedEmployees([...blockedEmployees, employeeId]);
    }
  };

  const handleUpdate = (employeeId, employeerole) => {
    setEmployeeId(employeeId);
    setEmployeeRole(employeerole);
    setShowEmployee(true);
  };

  const isDeleted = (employeeId) => deletedEmployees.includes(employeeId);
  const isBlocked = (employeeId) => blockedEmployees.includes(employeeId);

  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
  };


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

  
  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase();

        if (fileType === "pdf") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: "application/pdf" });
          return URL.createObjectURL(blob);
        }

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

        console.error(`Unsupported document type: ${fileType}`);
        return "Unsupported Document";
      } catch (error) {
        console.error("Error converting byte code to document:", error);
        return "Invalid Document";
      }
    }
    return "Document Not Found";
  };


  return (
    <div className="table-container">
      {!Loading ? (
        <>
          {!showEmployee ? (
            <div className="attendanceTableData">
              <center>
                <h1 className="emp-details-heading">Team Details</h1>
              </center>
              <table className="attendance-table">
                <thead>
                  <tr className="attendancerows-head">
                    <th className="attendanceheading">Employee Id</th>
                    <th className="attendanceheading">Employee Name</th>
                    <th className="attendanceheading">Employee Number</th>
                    <th className="attendanceheading">Date of Joining</th>
                    <th className="attendanceheading">Designation</th>
                    <th className="attendanceheading">Job Role</th>
                    <th className="attendanceheading">Department </th>
                    <th className="attendanceheading">Manager Name</th>
                    <th className="attendanceheading">Resume </th>
                    <th className="attendanceheading">Employee Status</th>
                    <th className="ActionCol">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.map((employee, index) => (
                    <tr key={index} className="attendancerows">
                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.id}
                        <div className="tooltip">
                          <span className="tooltiptext">{employee.id}</span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.name}
                        <div className="tooltip">
                          <span className="tooltiptext">{employee.name}</span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.contact}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {employee.contact}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.joinDate}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {employee.joinDate}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.designation}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {employee.designation}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.jobRole}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {employee.jobRole}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.department}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {employee.department}
                          </span>
                        </div>
                      </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.reportingManger}
                        <div className="tooltip">
                          <span className="tooltiptext">
                            {employee.reportingManger}
                          </span>
                        </div>
                      </td>

                      <td className="tabledata">
                          <button
                            onClick={() => openResumeModal(employee.resume)}
                            style={{ background: "none", border: "none" }}
                          >
                            <i
                              className="fas fa-eye"
                              style={{
                                color: employee.resume ? "green" : "inherit",
                              }}
                            ></i>
                          </button>
                        </td>

                      <td
                        className="tabledata"
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        {employee.status}
                        <div className="tooltip">
                          <span className="tooltiptext">{employee.status}</span>
                        </div>
                      </td>
                      <td>
                        <div className="emp-details-act-btn">
                          <button
                            className="action-button"
                            onClick={() => handleBlock(employee.id)}
                          >
                            {isBlocked(employee.employeeId)
                              ? "Unblock"
                              : "Block"}
                          </button>
                          <button
                            className="action-button"
                            onClick={() => {
                              handleUpdate(employee.id, employee.jobRole);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div>
                <UpdateEmployee id={employeeId} userType={employeeRole} />
              </div>
            </>
          )}{" "}
        </>
      ) : (
        <div className="register">
          <Loader></Loader>
        </div>
      )}

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

    </div>
  );
};

export default EmployeeDetails;
