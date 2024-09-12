import React, { useEffect, useState } from "react";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import "../Excel/resumeList.css";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/api";

const ResumeList = ({ loginEmployeeName }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employeeId, userType } = useParams();

  const [selectedCandidate, setSelectedCandidate] = useState();
  const [show, setShow] = useState(false);
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);

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

  const handleUpdateSuccess = () => {
    fetch(
      `${API_BASE_URL}/callingData/${employeeId}/${userType}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCallingList(data);
        setFilteredCallingList(data);
        setSelectedCandidateId(null); // Hide CallingTrackerForm after success
      })
      .catch((error) => console.error("Error fetching data:", error));
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
        <div className="table-container">
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
              {showExportConfirmation && (
                <div className="popup-containers">
                  <p className="confirmation-texts">
                    Are you sure you want to generate the Excel file?
                  </p>
                  <button onClick={confirmExport} className="buttoncss-ctn">
                    Yes
                  </button>
                  <button onClick={cancelExport} className="buttoncss-ctn">
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
          <div  className="attendanceTableData" style={{ maxHeight: '600px', overflowY: 'y', width: '100%' }}>
          <table className="selfcalling-table attendance-table"  >
              <thead>
              <tr className="attendancerows-head">
                  <th className="attendanceheading">Sr No</th>
                  <th className="attendanceheading">Candidate Name</th>
                  <th className="attendanceheading">Contact Number</th>
                  <th className="attendanceheading">Candidate Email</th>
                  {/* <th className="attendanceheading">Education</th> */}
                  <th className="attendanceheading">Current Company</th>
                  <th className="attendanceheading">Last Company</th>
                  <th className="attendanceheading">Job Designation</th>
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
                        <span className="tooltiptext">{item.candidateName}</span>
                      </div>
                    </td>
                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.contactNumber}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.contactNumber}</span>
                      </div>
                    </td>
                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.candidateEmail}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.candidateEmail}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.requirementCompany}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.requirementCompany}</span>
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
                      {item.jobDesignation}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.jobDesignation}</span>
                      </div>
                    </td>

                    <td
                      className="tabledata"
                      onMouseOver={handleMouseOver}
                      onMouseOut={handleMouseOut}
                    >
                      {item.currentLocation}
                      <div className="tooltip">
                        <span className="tooltiptext">{item.currentLocation}</span>
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
        </div>
      )}

      <div className="callingExcelData-update-form">
      {selectedCandidate && (
        <CallingTrackerForm
          initialData={selectedCandidate}
          loginEmployeeName={loginEmployeeName}
        />
      )}
</div>
    </div>
  );
};

export default ResumeList;
