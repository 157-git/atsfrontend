import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../AdminSection/Team_Leader.css";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { json, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../api/api";

function Accesstable() {
  const { employeeId } = useParams();
  const { userType } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState({});
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [selectedTeamLeaders, setSelectedTeamLeaders] = useState([]);


  const [selectedTeamLeader, setSelectedTeamLeader] = useState({});

  const [selectedRecruiters, setSelectedRecruiters] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [assignments, setAssignments] = useState({});
  const [allSelected, setAllSelected] = useState(false);


  // const [editRecruiter, setEditRecruiter] = useState(null);
  const [openCategory, setOpenCategory] = useState(""); // New state for open category
  // const [showSelection, setShowSelection] = useState(true);
  const [columnName, setColumnName] = useState(null);
  const [response, setResponse] = useState("");

  //Name:-Akash Pawar Component:-Team_Leadder Subcategory:-Assign Column TeamLeader Names and Recruiter Names(changed) Start LineNo:-17  Date:-03/07
  const [teamLeaderNames, setTeamLeaderNames] = useState([]);
  const [manager, setManager] = useState([]);
  const [teamLeaderUnderManager, setTeamLeaderUnderManager] = useState([]);
  const [recruiterUnderTeamLeader, setRecruiterUnderTeamLeader] = useState([]);
  const [assignedColumnsCount, setAssignedColumnsCount] = useState([]);
  const [openUpdateModal, setOpenupdateModal] = useState(false);
  const [fetchUpdateAssignedColumn, setFetchupdateAssignedColumn] = useState(
    []
  );

  const [assignedColumnRecruiterUpdate, setAssignedColumnRecruiterUpdate] =
    useState([]);

  // Akash_Pawar_AssignColumn_AssignColumnToRecruiterAndTeamLeader_15/07_LineNo_49_65
  useEffect(() => {
    const fetchManagerNames = async () => {
      const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
      if (userType === "SuperUser") {
        // Show all managers for the superuser
        setManager(response.data);
      } else {
        // Show only the manager's own name
        setManager(
          response.data.filter((manager) => manager.managerId == employeeId)
        );
      }
    };
    fetchManagerNames();
  }, []);

  // Akash_Pawar_AssignColumn_AssignColumnToRecruiterAndTeamLeader_15/07_LineNo_69_91
  useEffect(() => {
    const fetchTeamLeaderNames = async () => {
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${selectedManager.managerId}`
      );
      setTeamLeaderUnderManager(response.data);
    };
    if (selectedManager.managerId != "") {
      fetchTeamLeaderNames();
    }
  }, [selectedManager]);

  const fetchRecruiterUnderTeamLeader = useCallback(async () => {
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${selectedTeamLeader.teamLeaderId}`
    );
    setRecruiterUnderTeamLeader(response.data);
  }, [selectedTeamLeader]);

  useEffect(() => {
    if (selectedTeamLeader != null) {
      fetchRecruiterUnderTeamLeader();
    }
  }, [selectedTeamLeader, fetchRecruiterUnderTeamLeader]);

  //Name:-Akash Pawar Component:-Team_Leadder Subcategory:-Assign Column TeamLeader Names and Recruiter Names(changed) End LineNo:-44  Date:-03/07

  const fetchColumnsNames = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/fetch-columns-names`
    );
    setColumnName(response.data);
  };
  useEffect(() => {
    fetchColumnsNames();
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);


  const handleOptionChange = (columnId) => {
    if (selectedOptions.includes(columnId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== columnId));
    } else {
      setSelectedOptions([...selectedOptions, columnId]);
    }
  };

  const filteredRecruiters = useMemo(() => {
    return teamLeaderUnderManager.reduce((acc, leader) => {
      const leaderNameMatch = leader.teamLeaderName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const recruiters = leader.recruiters || []; // Ensure recruiters is defined
      const filteredRecruiters = recruiters.filter((recruiter) =>
        recruiter[1].toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (leaderNameMatch || filteredRecruiters.length > 0) {
        acc.push({
          ...leader,
          recruiters: leaderNameMatch ? recruiters : filteredRecruiters,
        });
      }

      return acc;
    }, []);
  }, [teamLeaderNames, searchTerm]);

  const toggleCategoryDropdown = (category) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const handleUpdateClick = (assigneID, assigneeName, assigneeJobRole) => {
    setOpenupdateModal(true);
    fetchAssignedColumn(assigneID, assigneeJobRole.replace(/\s+/g, ""));
    setAssignedColumnRecruiterUpdate({
      id: assigneID,
      name: assigneeName,
      jobRole: assigneeJobRole.replace(/\s+/g, ""),
    });
  };

  // Akash_Pawar_AssignColumn_AssignColumnToRecruiterAndTeamLeader_15/07_LineNo_158_165
  const fetchAssignedColumn = async (assigneID, assigneeJobRole) => {
    const response = await axios.get(
      `${API_BASE_URL}/column-by-id/${assigneID}/${assigneeJobRole}`
    );
    setFetchupdateAssignedColumn(response.data);
  };

  const handleOkClick = () => {
    if (selectedManager.managerId != "") {
      setDropdownOpen(false);
    }
  };

  // Akash_Pawar_AssignColumn_AssignColumnToRecruiterAndTeamLeader_15/07_LineNo_193_246
  const handleAssignColumns = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (selectedRecruiters.recruiterId != "") {
        response = await axios.post(
          `${API_BASE_URL}/${selectedRecruiters.recruiterId}/${selectedRecruiters.recruiterJobRole}/assign-column`,
          JSON.stringify(selectedOptions),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else if (selectedTeamLeader.teamLeaderId != "") {
        response = await axios.post(
          `${API_BASE_URL}/${selectedTeamLeader.teamLeaderId}/${selectedTeamLeader.teamLeaderJobRole}/assign-column`,
          JSON.stringify(selectedOptions),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_BASE_URL}/${selectedManager.managerId}/${selectedManager.managerJobRole}/assign-column`,
          JSON.stringify(selectedOptions),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      setResponse(response.data);

      setTimeout(() => {
        setSelectedRecruiters({
          recruiterId: "",
          recruiterJobRole: "",
          index: "",
        });
        setSelectedManager({ managerId: "", managerJobRole: "" });
        setSelectedTeamLeader({ teamLeaderId: "", teamLeaderJobRole: "" });
        setSelectedOptions([]);
        toast.success("assigning columns successfully"); //Swapnil Error&success message
        setResponse("");
      }, 2000);
      // Handle success, update state or show a success message
    } catch (error) {
      toast.error("Error assigning columns"); //Swapnil Error&success message
      // Handle error, show an error message or retry logic
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      setSelectedManagers([]);
      setSelectedTeamLeaders([]);
      setSelectedRecruiters([]);
    } else {
      // Select all
      setSelectedManagers(manager.map((id) => id.managerId));
      setSelectedTeamLeaders(teamLeaderUnderManager.map((teamleader) => teamleader.teamLeaderId));
      setSelectedRecruiters(recruiterUnderTeamLeaderData.map((recruiter) => recruiter.employeeId));
    }
    setAllSelected(!allSelected);
  }


  // Akash_Pawar_AssignColumn_AssignColumnToRecruiterAndTeamLeader_15/07_LineNo_260_269
  const fetchAssignedColumnCount = async () => {
    const response = await axios.get(
      `${API_BASE_URL}/column-category-counts/${employeeId}/${userType}`
    );
    setAssignedColumnsCount(response.data);
  };
  useEffect(() => {
    fetchAssignedColumnCount();
  }, [response]);

  const handleOpenModal = () => {
    setOpenupdateModal(false);
  };
  const handleResponse = (res) => {
    if (res) {
      fetchAssignedColumnCount();
    }
  };
  return (
    <div className="AppsTL">
      <div className="selection-containerTL">
        <div className="hierarchy-sectionTL">
          <div className="custom-dropdownTL">
            <div className="dropdown-headerTL" onClick={toggleDropdown}>
              {selectedRecruiters.index === ""
                ? "Select Team Leaders or Recruiters"
                : `${selectedRecruiters.index} Recruiter(s) selected`}
              <span
                className={`dropdown-icon_open ${dropdownOpen ? "open" : ""}`}
              >
                &#9660;
              </span>
            </div>
            {dropdownOpen && (
              <div className="dropdown-bodyTL">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-inputTL"
                />

                <div className="team-leadersTL">
                  {manager.map((id, index) => (
                    <div
                      key={index}
                      className="team-leader-itemTL checkbox-teamleader-assign radio-teamleader-assign"
                    >
                      <label>
                        <input
                          type="chechbox"
                          name="manager"
                          value={id.managerId}
                          checked={selectedManager.managerId === id.managerId}
                          onChange={() =>
                            setSelectedManager({
                              managerId: id.managerId,
                              managerJobRole: id.managerJobRole,
                            })
                          }
                        />
                        {id.managerName}
                      </label>

                      {selectedManager.managerId === id.managerId &&
                        teamLeaderUnderManager && (
                          <div className="recruitersTL" >
                            {teamLeaderUnderManager.map(
                              (teamleader, tIndex) => (
                                <div>
                                  <label key={tIndex}>
                                    <input
                                      type="checkbox"
                                      name="teamleader"
                                      value={teamleader.teamLeaderId}
                                      checked={
                                        selectedTeamLeader.teamLeaderId ===
                                        teamleader.teamLeaderId
                                      }
                                      onChange={() =>
                                        setSelectedTeamLeader({
                                          teamLeaderId: teamleader.teamLeaderId,
                                          teamLeaderJobRole: teamleader.jobRole,
                                        })
                                      }
                                    />
                                    {teamleader.teamLeaderName}
                                  </label>
                                  {selectedTeamLeader.teamLeaderId ===
                                    teamleader.teamLeaderId &&
                                    recruiterUnderTeamLeader && (
                                      <div className="recruitersTL">
                                        {recruiterUnderTeamLeader.map(
                                          (recruiter, rIndex) => (
                                            <label key={rIndex}>
                                              <input
                                                type="checkbox"
                                                name={`recruiter${recruiter.employeeId}`}
                                                value={recruiter.employeeId}

                                                onChange={() =>
                                                  setSelectedRecruiters((prevRecruiters) => [...prevRecruiters, recruiter.employeeId])
                                                }
                                              />
                                              {recruiter.employeeName}
                                            </label>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                <div className="TLR-buttons-div">
                  <button
                    className="select-all-buttonTL"
                    // onClick={toggleSelectAll}
                    onClick={handleSelectAll}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>

                  <button className="ok-button" onClick={handleOkClick}>
                    OK
                  </button>
                  <button
                    className="reset-selectTL-button"
                    onClick={() => {
                      setSelectedRecruiters([{
                        recruiterId: "",
                        recruiterJobRole: "",
                        index: "",
                      }]);
                      setSelectedManager({ managerId: "", managerJobRole: "" });
                      setSelectedTeamLeader({
                        teamLeaderId: "",
                        teamLeaderJobRole: "",
                      });
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="options-section">
          <div className="options-listTL">
            <div className={`options-category common-assign`}>
              <div
                className="category-header"
                onClick={() => toggleCategoryDropdown("common assign")}
              >
                <p>
                  Common Assign
                  <span className={`dropdown-icon`}> &#9660;</span>
                </p>
              </div>
              {openCategory === "common assign" && (
                <div className="category-options checkbox-teamleader-assign">
                  <div>
                    <button
                      className="category-share-btn"
                      onClick={() => {
                        setOpenCategory("");
                      }}
                    >
                      Close
                    </button>
                    <button
                      className="category-share-btn"
                      onClick={handleSelectAll}
                    >
                      {allSelected ? "Deselect All" : "Select All"}
                    </button>
                    {selectedOptions.length != 0 && (
                      <button className="category-share-btn">Ok</button>
                    )}
                  </div>
                  {columnName &&
                    columnName
                      .filter((item) => item.columnCategory === "common assign")
                      .map((option, optIndex) => (
                        <label key={optIndex} className="option-itemTL">
                          <input
                            type="checkbox"
                            value={option.columnId}
                            checked={selectedOptions.includes(option.columnId)}
                            onChange={() => handleOptionChange(option.columnId)}
                          />
                          {option.columnName}
                        </label>
                      ))}
                </div>
              )}
            </div>
            <div className={`options-category important-assign`}>
              <div
                className="category-header"
                onClick={() => toggleCategoryDropdown("important assign")}
              >
                Important Assign
                <span className={`dropdown-icon`}> &#9660;</span>
              </div>
              {openCategory === "important assign" && (
                <div className="category-options checkbox-teamleader-assign">
                  <button
                    className="category-share-btn"
                    onClick={() => setOpenCategory("")}
                  >
                    Close
                  </button>
                  <button
                    className="category-share-btn"
                    onClick={handleSelectAll}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                  {selectedOptions.length != 0 && (
                    <button
                      className="category-share-btn"
                      onClick={() => setOpenCategory("")}
                    >
                      Ok
                    </button>
                  )}
                  {columnName &&
                    columnName
                      .filter(
                        (item) => item.columnCategory === "important assign"
                      )
                      .map((option, optIndex) => (
                        <label key={optIndex} className="option-itemTL">
                          <input
                            type="checkbox"
                            value={option.columnId}
                            checked={selectedOptions.includes(option.columnId)}
                            onChange={() => handleOptionChange(option.columnId)}
                          />
                          {option.columnName}
                        </label>
                      ))}
                </div>
              )}
            </div>
            <div className={`options-category most-important-assign`}>
              <div
                className="category-header"
                onClick={() => toggleCategoryDropdown("most important assign")}
              >
                Most Important Assign
                <span className={`dropdown-icon`}> &#9660;</span>
              </div>
              {openCategory === "most important assign" && (
                <div className="category-options checkbox-teamleader-assign">
                  <button
                    className="category-share-btn"
                    onClick={() => setOpenCategory("")}
                  >
                    Close
                  </button>
                  <button
                    className="category-share-btn"
                    onClick={handleSelectAll}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                  {selectedOptions.length != 0 && (
                    <button
                      className="category-share-btn"
                      onClick={() => setOpenCategory("")}
                    >
                      Ok
                    </button>
                  )}

                  {columnName &&
                    columnName
                      .filter(
                        (item) =>
                          item.columnCategory === "most important assign"
                      )
                      .map((option, optIndex) => (
                        <label key={optIndex} className="option-itemTL">
                          <input
                            type="checkbox"
                            value={option.columnId}
                            checked={selectedOptions.includes(option.columnId)}
                            onChange={() => handleOptionChange(option.columnId)}
                          />
                          {option.columnName}
                        </label>
                      ))}
                </div>
              )}
            </div>
          </div>
          <div className="assignOptionBtnCss">
            {/* {response != "" ? (
              <div className="response-msg">{response}</div>
            ) : null} */}
            <button onClick={handleAssignColumns} className="assignoptionbtn">
              Assign Options
            </button>
          </div>
        </div>
      </div>
      <div className="assignments-tableTL">
        <center>
          <div className="container-after1">
            <div className="attendanceTableData1">
              <table className="attendance-table">
                <thead>
                  <tr className="attendancerows-head">
                    <th className="attendanceheading">Employee Id</th>
                    <th className="attendanceheading">Employee Name</th>
                    <th className="attendanceheading">Common Assign</th>
                    <th className="attendanceheading">Important Assign</th>
                    <th className="attendanceheading">Most Important Assign</th>
                    <th className="attendanceheading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedColumnsCount.map((assignee, index) => (
                    <tr key={index} className="attendancerows">
                      <td className="tabledata">{index + 1}</td>
                      <td className="tabledata">{assignee.employeeName}</td>
                      {/* <td className="tabledata">{assignee.employeeName}</td> */}
                      <td className="tabledata">
                        {assignee.commonAssignCount}
                      </td>
                      <td className="tabledata">
                        {assignee.importantAssignCount}
                      </td>
                      <td className="tabledata">
                        {assignee.mostImportantAssignCount}
                      </td>
                      <td className="tabledata">
                        <button
                          onClick={() =>
                            handleUpdateClick(
                              assignee.employeeId,
                              assignee.employeeName,
                              assignee.jobRole
                            )
                          }
                          className="all_assignbtn-Action"
                        >
                          <i
                            // onClick={() => handleUpdate(item.candidateId)}
                            className="fa-regular fa-pen-to-square"
                          ></i>

                        </button>

                        {/* <button onClick={() => handleRemoveClick(assignee)} className='remove_assignbtn'>
                          Remove
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </center>
      </div>
      {openUpdateModal ? (
        <UpdateAccessTable
          columnName={columnName}
          assignedColumnRecruiterUpdate={assignedColumnRecruiterUpdate}
          fetchUpdateAssignedColumn={fetchUpdateAssignedColumn}
          setOpenupdateModal={handleOpenModal}
          onSetResponse={handleResponse}
        />
      ) : null}
    </div>
  );
}

const UpdateAccessTable = ({
  onSetResponse,
  setOpenupdateModal,
  columnName,
  assignedColumnRecruiterUpdate,
  fetchUpdateAssignedColumn,
}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [response, setResponse] = useState("");

  useEffect(() => {
    if (fetchUpdateAssignedColumn) {
      const initialSelectedOptions = fetchUpdateAssignedColumn.map(
        (item) => item.columnId
      );

      setSelectedOptions(initialSelectedOptions);
    }
  }, [fetchUpdateAssignedColumn]);

  const handleOptionChange = (columnId) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(columnId)
        ? prevSelectedOptions.filter((id) => id !== columnId)
        : [...prevSelectedOptions, columnId]
    );
  };

  // Akash_Pawar_AssignColumn_AssignColumnToRecruiterAndTeamLeader_15/07_LineNo_680_701
  const handleUpdateClick = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${assignedColumnRecruiterUpdate.id}/${assignedColumnRecruiterUpdate.jobRole}/assign-column`,
        JSON.stringify(selectedOptions),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(response.data);
      setTimeout(() => {
        setResponse("");
        setOpenupdateModal(false);
        toast.success("Assign Column Successfully");
      }, 3000);
      onSetResponse(true);
    } catch (error) {
      toast.success("Failed To Assign Column");
      onSetResponse(false);
    }
  };

  return (
    <div
      className="bg-black bg-opacity-50 modal show"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        width: "100%",
        height: "100vh",
      }}
    >
      <Modal.Dialog
        className="modal-xl"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Modal.Header
          style={{
            fontSize: "18px",
            backgroundColor: "#f2f2f2",
            color: "gray",
          }}
        >
          Update Column Assigned
        </Modal.Header>
        <Modal.Body
          style={{
            backgroundColor: "#f2f2f2",
            color: "gray",
          }}
        >
          <h1 className="assignedColumnRecruiter">
            Recruiter Name: {assignedColumnRecruiterUpdate.name}
          </h1>
          <div
            className=""
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            <div
              className="commonAssinedColumnSec"
              style={{ gridColumn: "span 1/span 1" }}
            >
              <p>Common Column</p>
              <div className="commonAssignedColumn">
                {columnName &&
                  columnName
                    .filter((item) => item.columnCategory === "common assign")
                    .map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={option.columnId}
                          className=""
                          style={{ marginRight: "10px", zoom: "1.5" }}
                          checked={selectedOptions.includes(option.columnId)}
                          onChange={() => handleOptionChange(option.columnId)}
                        />
                        {option.columnName}
                      </label>
                    ))}
              </div>
            </div>
            <div
              className="importantAssignedColumnSec"
              style={{ gridColumn: "span 1/span 1" }}
            >
              <p>Important Column</p>
              <div className="importantAssignedColumn">
                {columnName &&
                  columnName
                    .filter(
                      (item) => item.columnCategory === "important assign"
                    )
                    .map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={option.columnId}
                          className=""
                          style={{ marginRight: "10px", zoom: "1.5" }}
                          checked={selectedOptions.includes(option.columnId)}
                          onChange={() => handleOptionChange(option.columnId)}
                        />
                        {option.columnName}
                      </label>
                    ))}
              </div>
            </div>
            <div
              className="mostImportantAssignedColumnSec"
              style={{ gridColumn: "span 1/span 1" }}
            >
              <p>Most Important Column</p>
              <div className="mostImportantAssignedColumn">
                {columnName &&
                  columnName
                    .filter(
                      (item) => item.columnCategory === "most important assign"
                    )
                    .map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          value={option.columnId}
                          className=""
                          style={{ marginRight: "10px", zoom: "1.5" }}
                          checked={selectedOptions.includes(option.columnId)}
                          onChange={() => handleOptionChange(option.columnId)}
                        />
                        {option.columnName}
                      </label>
                    ))}
              </div>
            </div>
          </div>
          {/* <div style={{ textAlign: "center", padding: "10px" }}>
            {response != "" && response}
          </div> */}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#f2f2f2" }}>
          <button
            onClick={handleUpdateClick}
            className="update-assign-column-btn"
          >
            Update
          </button>
          <button
            onClick={() => setOpenupdateModal(false)}
            className="update-assign-column-close-btn"
          >
            Close
          </button>
        </Modal.Footer>
      </Modal.Dialog>
    </div>
  );
};

export default Accesstable;
