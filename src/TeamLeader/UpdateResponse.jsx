import React, { useEffect, useState } from "react";
import "./UpdateResponse.css";
import { Button, Modal } from "react-bootstrap";
import UpdateResponseFrom from "./UpdateResponseFrom";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../api/api";
import Loader from "../EmployeeSection/loader";

const UpdateResponse = ({ onSuccessAdd, date }) => {
  const [updateResponseList, setUpdateResponseList] = useState([]);
  const [showUpdateResponseForm, setShowUpdateResponseForm] = useState(false);
  const [showUpdateResponseID, setShowUpdateResponseID] = useState();
  const [showEmployeeId, setShowEmployeeId] = useState();
  const [showRequirementId, setShowRequirementId] = useState();
  const [showSearch, setShowSearch] = useState(false);
  let [color, setColor] = useState("#ffcb9b");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [callingList, setCallingList] = useState([]);
  const [filteredCallingList, setFilteredCallingList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [activeFilterOption, setActiveFilterOption] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [formClosed, setFormClosed] = useState(false);

  const limitedOptions = [
    ["candidateId", "Candidate Id"],
    ["candidateName", "Candidate Name"],
    ["jobDesignation", "Job Designation"],
    ["requirementId", "Requirement Id"],
    ["employeeId", "Employee Id"],

    ["candidateEmail", "Candidate Email"],
    ["commentForTL", "Comment For TL"],
    ["contactNumber", "Contact Number"],
    ["finalStatus", "Final Status"],
    ["interviewResponse", "Interview Response"],
    ["interviewRound", "Interview Round"],
    ["jobRole", "Job Role"],
    ["nextInterviewDate", "Next Interview Date"],
    ["nextInterviewTiming", "Next Interview Timing"],
    ["officialMail", "Official Mail"],
    ["requirementCompany", "Requirement Company"],
    ["responseUpdatedDate", "Response Updated Date"],
    ["sourceName", "Source Name"],

    ["employeeName", "Employee Name"]
  ];
  useEffect(() => {
    const options = limitedOptions
      .filter(([key]) =>
        Object.keys(filteredCallingList[0] || {}).includes(key)
      )
      .map(([key]) => key);
      
    setFilterOptions(options);
  }, [filteredCallingList]);

  const { userType } = useParams();
  const { employeeId } = useParams();
  console.log(date);

  useEffect(() => {
    fetchUpdateResponseList();
    setFormClosed(false);
  }, [formClosed]);

  useEffect(() => {
    applyFilters();
  }, [filterType, filterValue, callingList]);

  useEffect(() => {
    filterData();
  }, [selectedFilters, callingList]);

  const fetchUpdateResponseList = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/update-candidate-data/${employeeId}/${userType}`
      );
      const data = await res.json(); 
      if (Array.isArray(data)) {
        setCallingList(data);
        setFilteredCallingList(data);
        setUpdateResponseList(data);
        setFormClosed(false);
      } else {
        console.error("Expected array but received:", data);
        setCallingList([]);
        setFilteredCallingList([]);
        setUpdateResponseList([]);
      }
      // setLoading(false);
      setLoading(false)
    } catch (err) {
      console.log("Error fetching shortlisted data:", err);
      setLoading(false);
    }
  };

  // const applyFilters = () => {
  //   if (!filterType || !filterValue) {
  //     setFilteredCallingList(updateResponseList);
  //     return;
  //   }

  //   const filteredList = updateResponseList.filter((data) => {
  //     return data[filterType]
  //       ?.toString()
  //       .toLowerCase()
  //       .includes(filterValue.toLowerCase());
  //   });

  //   setFilteredCallingList(filteredList);
  // };

  const applyFilters = () => {
    const lowerSearchTerm = filterValue.toLowerCase();
    let filteredResults = updateResponseList.filter((item) => {
      return (
        item.candidateName?.toLowerCase().includes(lowerSearchTerm) ||
        item.candidateEmail?.toLowerCase().includes(lowerSearchTerm) ||
        item.jobDesignation?.toLowerCase().includes(lowerSearchTerm) ||
        // this is not found in data but it is not affecting other code so keep this for future purpose added by sahil karnekar date 25-11-2024
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
        item.candidateId?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.commentForTL?.toLowerCase().includes(lowerSearchTerm) ||
        item.sourceName?.toLowerCase().includes(lowerSearchTerm) ||
        item.requirementId?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.requirementCompany?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.finalStatus?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.interviewRound?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.interviewResponse?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.nextInterviewDate?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.nextInterviewTiming?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.employeeId?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.employeeName?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.officialMail?.toString().toLowerCase().includes(lowerSearchTerm) ||
        item.jobRole?.toString().toLowerCase().includes(lowerSearchTerm) ||
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

    setFilteredCallingList(filteredResults);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setFilterValue("");
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  const convertToDocumentLink = (byteCode, fileName) => {
    if (byteCode) {
      try {
        const fileType = fileName.split(".").pop().toLowerCase();

        if (fileType === "pdf" || fileType === "docx") {
          const binary = atob(byteCode);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], {
            type:
              fileType === "pdf"
                ? "application/pdf"
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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

  const handleUpdateClick = (candidateId, employeeId, requirementId) => {
    setShowUpdateResponseID(candidateId);
    setShowEmployeeId(employeeId);
    setShowRequirementId(requirementId);
    setShowUpdateResponseForm(true);
  };

  const closeUpdateForm = () => {
    setShowUpdateResponseID(null);
    setShowEmployeeId(null);
    setShowRequirementId(null);
    setShowUpdateResponseForm(false);
    setFormClosed(true);
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

  const filterData = () => {
    let filteredData = [...callingList];
    Object.entries(selectedFilters).forEach(([option, values]) => {
      if (values.length > 0) {
        if (option === "candidateId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "requirementId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "employeeId") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "contactNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else if (option === "alternateNumber") {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]?.toString().toLowerCase().includes(value)
            )
          );
        } else {
          filteredData = filteredData.filter((item) =>
            values.some((value) =>
              item[option]
                ?.toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            )
          );
        }
      }
    });
    setFilteredCallingList(filteredData);
  }; 

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
  console.log(filteredCallingList);

  const calculateWidth = () => {
    const baseWidth = 250;
    const increment = 10;
    const maxWidth = 600;
    return Math.min(baseWidth + filterValue.length * increment, maxWidth);
  };

  return (
    // SwapnilRokade_UpdateResponse_FilterAdded_7_to_504_10/07"
    <div className="TeamLead-main">
      {loading ? (
        <div className="register">
          <Loader></Loader>
        </div>
      ) : (
        <>
          {!showUpdateResponseForm ? (
            <>
              <div className="TeamLead-main-filter-section">
                <div className="TeamLead-main-filter-section-header">
                  <div
                  style={{display:"flex"}}
                  >
                  <div
                    className="search"
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>

                  <div className="TeamLead-main-filter-section-container"
                  style={{width:"100%"}}
                  >
                  <div
                    className="search-input-div"
                    style={{ width: `${calculateWidth()}px` }}
                  >
                    <div className="forxmarkdiv">
                    <input
                      type="text"
                      className="search-input removeBorderForSearchInput"
                      placeholder="Search here..."
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                    { filterValue && (
                      <div className="svgimagesetinInput">
                    <svg onClick={(()=>setFilterValue(""))} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                    )}
                    
                    </div>
                  </div>

                    {/* <select
                      className="white-Btn"
                      value={filterType}
                      onChange={handleFilterTypeChange}
                    >
                      <option value="">Select Filter Type</option>
                      <option value="candidateId">Candidate ID</option>
                      <option value="candidateName">Candidate Name</option>
                      <option value="requirementId">Requirement ID</option>
                      <option value="requirementCompany">
                        Requirement Company
                      </option>
                      <option value="jobDesignation">Job Designation</option>
                      <option value="employeeName">Employee Name</option>
                      <option value="employeeId">Employee ID</option>
                    </select> */}
                  </div>
                  </div>
                  <div>
                  <h1 style={{ color: "gray" }}>Update Response</h1>
                  </div>
                  <div>
                    <button
                      className="lineUp-share-btn"
                      onClick={() => {
                        setShowFilterOptions(!showFilterOptions);
                        setShowSearch(false);
                      }}
                    >
                      Filter
                    </button>
                  </div>
                </div>
               
                <div className="filter-dropdowns">
                {showFilterOptions && (
                   <div className="filter-section">
                   {limitedOptions.map(([optionKey, optionLabel]) => {
                     const uniqueValues = Array.from(
                       new Set(
                        callingList
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
                </div>
              </div>
              <div className="attendanceTableData">
                <table className="attendance-table">
                  <thead>
                    <tr className="attendancerows-head">
                      <th className="attendanceheading">Sr No</th>
                      <th className="attendanceheading">Candidate ID</th>
                      <th className="attendanceheading">Candidate Name</th>
                      <th className="attendanceheading">Candidate Email</th>
                      <th className="attendanceheading">Contact Number</th>
                      <th className="attendanceheading">Source Name</th>
                      <th className="attendanceheading">Job Id</th>
                      <th className="attendanceheading">Applying Company</th>
                      <th className="attendanceheading">Job Designation</th>
                      <th className="attendanceheading">Comment for TL</th>
                      <th className="attendanceheading">Last Status</th>
                      <th className="attendanceheading">Interview Round</th>
                      <th className="attendanceheading">Interview Response</th>
                      <th className="attendanceheading">
                        Response Updated Date
                      </th>
                      <th className="attendanceheading">Next Interview Date</th>
                      <th className="attendanceheading">
                        Next Interview Timing
                      </th>
                      <th className="attendanceheading">Employee ID</th>
                      <th className="attendanceheading">Employee Name</th>
                      <th className="attendanceheading">Employee Mail Id</th>
                      <th className="attendanceheading">Employee Role</th>
                      <th className="attendanceheading">Resume</th>
                      <th className="attendanceheading">
                         Manager Name
                      </th>
                      <th className="attendanceheading">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCallingList.map((data, index) => (
                      <tr key={index} className="attendancerows">
                        <td className="tabledata">{index + 1}</td>
                        <td className="tabledata">{data.candidateId}</td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.candidateName || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.candidateName}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.candidateEmail || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.candidateEmail}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.contactNumber || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.contactNumber}
                            </span>
                          </div>
                        </td>


                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.sourceName || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.sourceName}
                            </span>
                          </div>
                        </td>
                     
                        <td className="tabledata">{data.requirementId}</td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.requirementCompany || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.requirementCompany}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.jobDesignation || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.jobDesignation}
                            </span>
                          </div>
                        </td>

                        <td className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                         >
                          {data.commentForTL || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.commentForTL}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.finalStatus || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.finalStatus}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.interviewRound || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.interviewRound}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.interviewResponse || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.interviewResponse}
                            </span>
                          </div>
                        </td>
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.responseUpdatedDate || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.responseUpdatedDate}
                            </span>
                          </div>
                        </td>
                        <td className="tabledata">{data.nextInterviewDate}</td>
                        <td className="tabledata">
                          {data.nextInterviewTiming}
                        </td>
                        <td className="tabledata">{data.employeeId}</td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.employeeName || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.employeeName}
                            </span>
                          </div>
                        </td>

                       
                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.officialMail || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.officialMail}
                            </span>
                          </div>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.jobRole || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.jobRole}
                            </span>
                          </div>
                        </td>

                        <td className="tabledata">
                          <button
                            onClick={() => openResumeModal(data.resume)}
                            style={{ background: "none", border: "none" }}
                          >
                            <i
                              className="fas fa-eye"
                              style={{
                                color: data.resume ? "green" : "inherit",
                              }}
                            ></i>
                          </button>
                        </td>

                        <td
                          className="tabledata"
                          onMouseOver={handleMouseOver}
                          onMouseOut={handleMouseOut}
                        >
                          {data.reportingManagerName || "-"}
                          <div className="tooltip">
                            <span className="tooltiptext">
                              {data.reportingManagerName}
                            </span>
                          </div>
                        </td>

                        <td className=" TeamLead-main-table-td">
                          <button
                            className="TeamLead-main-table-button"
                            onClick={() =>
                              handleUpdateClick(
                                data.candidateId,
                                data.employeeId,
                                data.requirementId
                              )
                            }
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Modal show={showResumeModal} onHide={closeResumeModal} size="md">
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
            </>
          ) : (
            <>
              <Modal
                show={showUpdateResponseForm}
                onHide={closeUpdateForm}
                size="xl"
                centered
              >
                <Modal.Body>
                  <div className="TeamLead-main-table-container">
                    <UpdateResponseFrom
                      candidateId={showUpdateResponseID}
                      employeeId={showEmployeeId}
                      requirementId={showRequirementId}
                      onClose={closeUpdateForm}
                      onSuccessAdd={onSuccessAdd}
                    />
                  </div>
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateResponse;
