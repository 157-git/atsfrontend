import React, { useEffect, useState } from "react";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import "../Excel/resumeList.css";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/api";
 {/* this line added by sahil date 22-10-2024 */}
import Modal from "react-modal";

// custom styling added by sahil karnekar date 22-10-2024
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    textAlign: 'center',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Black overlay
  },
};

const ResumeList = ({ loginEmployeeName,onsuccessfulDataAdditions }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [show, setShow] = useState(false);
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  const { employeeId, userType } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/fetch-resumes-data/${employeeId}/${userType}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


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

  //Swapnil_Rokade_ResumeList_columnsToInclude_columnsToExclude_18/07/2024//
  const handleExportToExcel = () => {
    const columnsToInclude = [
      "No.",
      "Candidate's Name",
      "Contact Number",
      "Alternate Number",
      "Candidate Email",
      "Education",
      "Experience",
      "Current Location",
    ];

    const dataToExport = data.map((item, index) => {
      const filteredItem = {
        "No.": index + 1,
        "Candidate's Name": item.name || "-",
        "Contact Number": item.phone || "-",
        "Alternate Number": item.phone || "-",
        "Candidate Email": item.email || "-",
        Education: item.education || "-",
        Experience: item.experience || "-",
        "Current Location": item.location || "-",
      };
      return filteredItem;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport, {
      header: columnsToInclude,
    });

    const headerRange = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRange.s.r, c: C })];
      if (cell) {
        cell.s = {
          font: {
            bold: true,
            color: { rgb: "000000" },
            sz: 20,
          },
          fill: {
            patternType: "solid",
            fgColor: { rgb: "FF0000" }, // Red background
          },
        };
      }
    }

    // Save the Excel file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resume List");
    XLSX.writeFile(wb, "ResumeList.xlsx");
  };

  const showPopup = () => {
    setShowExportConfirmation(true);
    document.querySelector(".table-container").classList.add("blurred");
  };

  const hidePopup = () => {
    setShowExportConfirmation(false);
    document.querySelector(".table-container").classList.remove("blurred");
  };

  const confirmExport = () => {
    setShowExportConfirmation(false);
    handleExportToExcel();
    hidePopup();
  };

  const cancelExport = () => {
    hidePopup();
  };

  const handleUpdate = (candidateData) => {
    setShow(true);
    setSelectedCandidate(candidateData); // Set candidate data for CallingTrackerForm
  };
  //Swapnil_Rokade_ResumeList_columnsToInclude_columnsToExclude_18/07/2024//

  return (
    <div className="App-after1">
      {!selectedCandidate && (
        <>
          <div className="rl-filterSection">
            <div className="filterSection">
              <h1 className="resume-data-heading">Resume Data</h1>
            </div>
            {/* Swapnil_Rokade_ResumeList_CreateExcel_18/07/2024 */}
            <div>
              <div className="rl-btn-div">
                <button className="rl-create-Excel-btn" onClick={showPopup}>
                  Create Excel
                </button>
              </div>
              {/* this modal added by sahil date 22-10-2024 */}
              <Modal
                isOpen={showExportConfirmation}
                onRequestClose={hidePopup}
                style={customStyles}
                contentLabel="Export Confirmation Modal"
              >
                <p className="confirmation-texts">
                  Are you sure you want to generate the Excel file?
                </p>
                <button onClick={confirmExport} className="buttoncss-ctn">
                  Yes
                </button>
                <button onClick={cancelExport} className="buttoncss-ctn">
                  No
                </button>
              </Modal>
            </div>
          </div>

          <div className="attendanceTableData">
            <table className="selfcalling-table attendance-table">
              <thead>
                 {/* this line updated by sahil date 22-10-2024 */}
                <tr className="attendancerows-head" style={{position:"sticky"}}>
                  <th className="attendanceheading">Sr No</th>
                  <th className="attendanceheading"> Resume Upload Date</th>
                  <th className="attendanceheading">Candidate Name</th>
                  <th className="attendanceheading">Candidate Email</th>
                  <th className="attendanceheading">Gender</th>
                  <th className="attendanceheading">Date Of Birth</th>
                  <th className="attendanceheading">Contact Number</th>
                  <th className="attendanceheading">Job Designation</th>
                  <th className="attendanceheading">Last Company</th>
                  <th className="attendanceheading">Relevant Experience</th>
                  <th className="attendanceheading">Education</th>
                  <th className="attendanceheading">Extra Certification</th>
                  <th className="attendanceheading">Current Location</th>
                  <th className="attendanceheading">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.candidateId} className="attendancerows">
                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {index + 1}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{index + 1}</span>
                      </div>
                    </td>
                    <td
                   style={{paddingLeft:"3px"}}
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.resumeUploadDate}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.resumeUploadDate}</span>
                      </div>
                    </td>
                    <td
                      hidden
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateId}{" "}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.candidateId}</span>
                      </div>
                    </td>
                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateName}{" "}
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
                      {item.candidateEmail}
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
                      {item.gender}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.gender}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.dateOfBirth}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.dateOfBirth}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.contactNumber}
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
                      {item.jobDesignation}
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
                      {item.companyName}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.companyName}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.relevantExperience}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.relevantExperience}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.qualification}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.qualification}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.extraCertification}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.extraCertification}
                        </span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.currentLocation}
                      <div className="tooltip">
                        <span className="tooltiptext">
                          {item.currentLocation}
                        </span>
                      </div>
                    </td>

                    <td className="tabledata" style={{ textAlign: "center" }}>
                      <i
                        onClick={() => handleUpdate(item)}
                        className="fa-regular fa-pen-to-square"
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="callingExcelData-update-form">
        {selectedCandidate && (
          <CallingTrackerForm
            initialData={selectedCandidate}
            loginEmployeeName={loginEmployeeName}
            onsuccessfulDataAdditions={onsuccessfulDataAdditions}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeList;
