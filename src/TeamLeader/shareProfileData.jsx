import React, { useEffect, useState } from "react";
import CallingTrackerForm from "../EmployeeSection/CallingTrackerForm";
import "../Excel/resumeList.css";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { API_BASE_URL } from "../api/api";
{/* this line added by sahil date 22-10-2024 */}
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Loader from "../EmployeeSection/loader";
import { parse } from "date-fns";
{/* this line added by sahil date 22-10-2024 */}
const ShareProfileData = ({ loginEmployeeName, onsuccessfulDataAdditions }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState();
  const [show, setShow] = useState(false);
  const [showExportConfirmation, setShowExportConfirmation] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedCandidateResume, setSelectedCandidateResume] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // For search input
  const [filteredData, setFilteredData] = useState([]); // To store filtered results
  const { employeeId, userType } = useParams();
  const [showFilterSection, setShowFilterSection] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/share-profile-count-data`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        setFilteredData(result);
        console.log(filteredData);
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

  const handleUpdate = (candidateData) => {
    setShow(true);
    setSelectedCandidate(candidateData); // Set candidate data for CallingTrackerForm
  };
  //Swapnil_Rokade_ResumeList_columnsToInclude_columnsToExclude_18/07/2024//
  const openResumeModal = (byteCode) => {
    setSelectedCandidateResume(byteCode);
    setShowResumeModal(true);
  };

  const closeResumeModal = () => {
    setSelectedCandidateResume("");
    setShowResumeModal(false);
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

  const toggleFilterSection = () => {
    setShowFilterSection(!showFilterSection);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const limitedOptions = [
    ["candidateEmail", "Candidate Email"],
    ["candidateName", "Candidate Name"],
    ["contactNumber", "Contact Number"],
    ["currentLocation", "Current Location"],
    ["date", "Date"],
    ["fullAddress", "Full Address"],
    ["jobDesignation", "Job Designation"],
    ["requirementCompany", "Requirement Company"],
    ["empId", "Employee Id"],
    ["companyName", "Company Name"],
    ["currentCTCLakh", "Current CTC (Lakh)"],
    ["currentCTCThousand", "Current CTC (Thousand)"],
    ["dateOfBirth", "Date Of Birth"],
    ["expectedCTCLakh", "Expected CTC (Lakh)"],
    ["expectedCTCThousand", "Expected CTC (Thousand)"],
    ["experienceMonth", "Experience (Months)"],
    ["experienceYear", "Experience (Years)"],
    ["finalStatus", "Final Status"],
    ["holdingAnyOffer", "Holding Any Offer"],
    ["noticePeriod", "Notice Period"],
  ];
  const handleFilterOptionClick = (key) => {
    if (activeFilterOption === key) {
      setActiveFilterOption(null); // Close the current filter
    } else {
      setActiveFilterOption(key); // Open a new filter section
    }

    // Initialize the selected filter array if it doesn't exist
    setSelectedFilters((prev) => {
      const newSelectedFilters = { ...prev };
      if (!newSelectedFilters[key]) {
        newSelectedFilters[key] = []; // Create an empty array for values
      }
      return newSelectedFilters;
    });
  };

  const handleFilterSelect = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((item) => item !== value) // Deselect the value
        : [...prev[key], value], // Select the value
    }));
  };
  const applyFilters = () => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    let filteredResults = data.filter((item) => {
      // Apply search term filtering first
      return (
        item.candidateName?.toLowerCase().includes(lowerSearchTerm) ||
        item.candidateEmail?.toLowerCase().includes(lowerSearchTerm) ||
        item.jobDesignation?.toLowerCase().includes(lowerSearchTerm) ||
        item.currentLocation?.toLowerCase().includes(lowerSearchTerm) ||
        item.companyName?.toLowerCase().includes(lowerSearchTerm) ||
        item.contactNumber
          ?.toString()
          .toLowerCase()
          .includes(lowerSearchTerm) ||
        item.dateOfBirth?.toLowerCase().includes(lowerSearchTerm) ||
        item.extraCertification?.toLowerCase().includes(lowerSearchTerm) ||
        item.gender?.toLowerCase().includes(lowerSearchTerm) ||
        item.jobRole?.toLowerCase().includes(lowerSearchTerm) ||
        item.qualification?.toLowerCase().includes(lowerSearchTerm) ||
        item.relevantExperience?.toLowerCase().includes(lowerSearchTerm) ||
        item.resumeUploadDate?.toLowerCase().includes(lowerSearchTerm)
      );
    });

    // Apply selected filters
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        filteredResults = filteredResults.filter((item) =>
          values.some((value) =>
            item[option]
              ?.toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())
          )
        );
      }
    });

    setFilteredData(filteredResults);
  };

  useEffect(() => {
    applyFilters(); // Reapply filters whenever the data or selected filters change
  }, [searchTerm, data, selectedFilters]);

  const formatToIndianTime = (dateString) => {
    // Parse the custom format "dd-MM-yyyy h:mm a"
    const date = parse(dateString, "dd-MM-yyyy h:mm a", new Date());
    // Check if the parsed date is valid
    if (isNaN(date)) {
      return "Invalid Date";
    }
    // Format the date to Indian Time (IST)
    const indianOffset = 5.5 * 60; // IST offset in minutes
    const utcOffset = date.getTimezoneOffset();
    const istDate = new Date(
      date.getTime() + (indianOffset + utcOffset) * 60000
    );

    return istDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // Force IST format
    });
  };

  return (
    <div className="App-after1">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!selectedCandidate && (
            <>
              <div className="rl-filterSection">
                <div className="filterSection">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <i
                      className="fa-solid fa-magnifying-glass"
                      onClick={() => {
                        setShowSearchBar(!showSearchBar);
                        setShowFilterSection(false);
                      }}
                      style={{
                        margin: "10px",
                        width: "auto",
                        fontSize: "15px",
                      }}
                    ></i>
                    {showSearchBar && (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    )}
                  </div>
                  <h1 className="resume-data-heading">Shared Profile Data</h1>
                  <div className="rl-btn-div">
                    <button
                      style={{ marginRight: "20px" }}
                      onClick={toggleFilterSection}
                      className="daily-tr-btn"
                    >
                      Filter <i className="fa-solid fa-filter"></i>
                    </button>
                    {/* {(userType === "Manager" || userType === "TeamLeader") && (
                      <button className="lineUp-share-btn" >
                        Create Excel
                      </button>
                    )} */}

                    {showExportConfirmation && (
                      <div className="popup-containers">
                        <p className="confirmation-texts">
                          Are you sure you want to generate the Excel file?
                        </p>
                        <button
                          onClick={confirmExport}
                          className="buttoncss-ctn"
                        >
                          Yes
                        </button>
                        <button
                          onClick={cancelExport}
                          className="buttoncss-ctn"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Swapnil_Rokade_ResumeList_CreateExcel_18/07/2024 */}
                <div>
                  {showFilterSection && (
                    <div className="filter-section">
                      {limitedOptions.map(([optionKey, optionLabel]) => {
                        const uniqueValues = Array.from(
                          new Set(
                            data
                              .map((item) => {
                                const value = item[optionKey];
                                // Ensure the value is a string before converting to lowercase
                                return typeof value === "string"
                                  ? value.toLowerCase()
                                  : value;
                              })
                              .filter(
                                (value) => value !== undefined && value !== null
                              ) // Remove null or undefined values
                          )
                        );

                        return (
                          <div key={optionKey} className="filter-option">
                            <button
                              className="white-Btn"
                              onClick={() => handleFilterOptionClick(optionKey)}
                            >
                              {optionLabel}
                              <span className="filter-icon">&#x25bc;</span>
                            </button>
                            {activeFilterOption === optionKey && (
                              <div className="city-filter">
                                <div className="optionDiv">
                                  {uniqueValues.filter(
                                    (value) =>
                                      value !== "" &&
                                      value !== "-" &&
                                      value !== undefined &&
                                      !(
                                        optionKey === "alternateNumber" &&
                                        value === 0
                                      )
                                  ).length > 0 ? (
                                    uniqueValues.map(
                                      (value) =>
                                        value !== "" &&
                                        value !== "-" &&
                                        value !== undefined &&
                                        !(
                                          optionKey === "alternateNumber" &&
                                          value === 0
                                        ) && (
                                          <label
                                            key={value}
                                            className="selfcalling-filter-value"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                selectedFilters[
                                                  optionKey
                                                ]?.includes(value) || false
                                              }
                                              onChange={() =>
                                                handleFilterSelect(
                                                  optionKey,
                                                  value
                                                )
                                              }
                                              style={{ marginRight: "5px" }}
                                            />
                                            {value}
                                          </label>
                                        )
                                    )
                                  ) : (
                                    <div>No values</div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* this modal added by sahil date 22-10-2024 */}
                </div>
              </div>

              <div className="attendanceTableData">
                <table className="selfcalling-table attendance-table">
                  <thead>
                    {/* this line updated by sahil date 22-10-2024 */}
                    <tr
                      className="attendancerows-head"
                      style={{ position: "sticky" }}
                    >
                      <th className="attendanceheading">No</th>
                      <th className="attendanceheading">Company Name</th>
                      <th className="attendanceheading">Job Id</th>
                      <th className="attendanceheading">Designation</th>
                      <th className="attendanceheading">Receiver E-Mail</th>
                      <th className="attendanceheading">Sender E-Mail</th>
                      <th className="attendanceheading">Mail Send Date</th>

                      <th className="attendanceheading">Total Sent Profiles</th>
                      <th className="attendanceheading">Selected Profiles</th>
                      <th className="attendanceheading">Rejected Profiles</th>
                      <th className="attendanceheading">Pending Profiles</th>
                      <th className="attendanceheading">Hold Profile</th>
                      <th className="attendanceheading">No Response</th>

                      <th className="attendanceheading">Profiles In Process</th>
                      <th className="attendanceheading">Selected Candidate</th>
                      <th className="attendanceheading">Rejected Candidate</th>
                      <th className="attendanceheading">Hold Candidate</th>

                      {/* <th className="attendanceheading">Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr className="attendancerows">
                        <td
                          className="tabledata "
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {index + 1}{" "}
                          <div className="tooltip">
                            <span className="tooltiptext">{index + 1}</span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.companyName}{" "}
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
                          {item.requirementId}{" "}
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
                          {item.designation}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.designation}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.receiverCompanyMail}
                          <div className="tooltip">
                            <span className="tooltiptext">{item.receiverCompanyMail}</span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.senderEmailId}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.senderEmailId}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.mailSendDate}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.mailSendDate}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.profileSentCount}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.profileSentCount}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.profileSelected}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.profileSelected}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.profileRejected}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.profileRejected}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.profilePending}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.profilePending}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.profileOnHold}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.profileOnHold}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.noResponse}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.noResponse}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.inProcessCount}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.inProcessCount}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.selectedCount}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.selectedCount}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.rejectedCount}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.rejectedCount}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {item.holdCount}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {item.holdCount}
                            </span>
                          </div>
                        </td>

                        {/* <td className="tabledata">
                          <button
                          
                            onClick={() => openResumeModal(item.resume)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>

                        <td
                          className="tabledata"
                          style={{ textAlign: "center" }}
                        >
                          <i
                            onClick={() => handleUpdate(item)}
                            className="fa-regular fa-pen-to-square"
                          ></i>
                        </td> */}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <Modal
                  show={showResumeModal}
                  onHide={closeResumeModal}
                  size="md"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Resume</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {selectedCandidateResume ? (
                      <iframe
                        src={convertToDocumentLink(
                          selectedCandidateResume,
                          "Resume.pdf"
                        )}
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
        </>
      )}
    </div>
  );
};

export default ShareProfileData;
