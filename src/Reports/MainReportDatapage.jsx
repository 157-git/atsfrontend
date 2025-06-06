{
  /* Name:-Prachi Parab Component:-Report data page
           End LineNo:-1 to 249 Date:-04/07 */
}
import React, { useState, useMemo, useCallback, useEffect } from "react";
import "../Reports/MainReportDatapage.css";
import CreateReportTable from "../Reports/CreateReportTable";
import axios from "axios";
import { json, useParams } from "react-router-dom";
import "../Reports/MainReportDatapage.css";
import { API_BASE_URL } from "../api/api";
import { data } from "autoprefixer";
import Loader from "../EmployeeSection/loader";
import { Avatar, Button, Card, List, Modal, Skeleton } from "antd";
import { getUserImageFromApiForReport } from "./getUserImageFromApiForReport";
import { ClearOutlined, DownOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const MonthReport = ({ loginEmployeeName }) => {
  const { userType } = useParams();
  const { employeeId } = useParams();
  const [reportDataDatewise, setReportDataDatewise] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openSelectDate, setOpenSelectDate] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [displayManagerDivWithBtn, setdisplayManagerDivWithBtn] =
    useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finalStartDatePropState, setFinalStartDatePropState] = useState("");
  const [finalEndDatePropState, setFinalEndDatePropState] = useState("");
  const handleOpenSelectDate = (id) => {
    setActiveButton(id); // Set active button
    setOpenSelectDate(true);
  };

  const [managersList, setManagersList] = useState([]);
  const [teamLeadersList, setTeamLeadersList] = useState([]);
  const [recruitersList, setRecruitersList] = useState([]);
  const [activeManager, setActiveManager] = useState(null); // Tracks active manager dropdown
  const [activeTeamLeader, setActiveTeamLeader] = useState(null); // Tracks active team leader dropdown
  const [managerToTeamLeaders, setManagerToTeamLeaders] = useState({}); // Maps managerId to teamLeaderIds
  const [teamLeaderToRecruiters, setTeamLeaderToRecruiters] = useState({}); // Maps teamLeaderId to recruiterIds

console.log(finalStartDatePropState);


  const toggleManager = (managerId) => {
    if (activeManager === managerId) {
      // If the same manager is clicked again, reverse the rotation
      setActiveManager(null);
    } else {
      // Rotate the new manager's icon and reverse the previous one
      setActiveManager(managerId);
    }
  };

  const toggleTeamLeader = (teamLeaderId) => {
    if (activeTeamLeader === teamLeaderId) {
      // If the same team leader is clicked again, reverse the rotation
      setActiveTeamLeader(null);
    } else {
      // Rotate the new team leader's icon and reverse the previous one
      setActiveTeamLeader(teamLeaderId);
    }
  };

  const handleDisplayManagers = async () => {
    setDisplayModalContainer(true);
    if (userType === "SuperUser") {
      setDisplayBigSkeletonForManagers(true);
      const response = await axios.get(`${API_BASE_URL}/get-all-managers`);
      setManagersList(response.data);
      setDisplayBigSkeletonForManagers(false);
      setDisplayManagers(true);
    } else if (userType === "Manager") {
      setDisplayBigSkeletonForTeamLeaders(true);
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${employeeId}`
      );

      setTeamLeadersList(response.data);
      setDisplayBigSkeletonForTeamLeaders(false);
      setDisplayTeamLeaders(true)
    } else if (userType === "TeamLeader") {
      setDisplayBigSkeletonForRecruiters(true);
      const response = await axios.get(
        `${API_BASE_URL}/employeeId-names/${employeeId}`
      );

      setRecruitersList(response.data);
      setDisplayBigSkeletonForRecruiters(false);
      setDisplayRecruiters(true);
    }
    // setDisplayModalContainer(true);
  };

  const scrollLeft = () => {
    const container = document.querySelector(".typesOfReportDiv");
    container.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = document.querySelector(".typesOfReportDiv");
    container.scrollBy({ left: 300, behavior: "smooth" });
  };
  console.log(selectedIds);

  const handleOpenDownArrowContent = async (managerid) => {
    setDisplayTeamLeaders(false);
    // setSelectedIds([]);
    setAllImagesForTeamLeaders([]);
    try {
      setDisplayBigSkeletonForTeamLeaders(true);
      const response = await axios.get(
        `${API_BASE_URL}/tl-namesIds/${managerid}`
      );
      setTeamLeadersList(response.data);
      setManagerToTeamLeaders((prev) => ({
        ...prev,
        [managerid]: response.data.map((tl) => tl.teamLeaderId), // Map manager to team leaders
      }));
      setDisplayBigSkeletonForTeamLeaders(false);
      setDisplayTeamLeaders(true);
      setDisplayRecruiters(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDownArrowContentForRecruiters = async (teamLeaderId) => {
    setDisplayRecruiters(false);
    // setSelectedIds([]);
    setAllImagesForRecruiters([]);
    setDisplayBigSkeletonForRecruiters(true);
    const response = await axios.get(
      `${API_BASE_URL}/employeeId-names/${teamLeaderId}`
    );
    setRecruitersList(response.data);
    setTeamLeaderToRecruiters((prev) => ({
      ...prev,
      [teamLeaderId]: response.data.map((recruiter) => recruiter.employeeId), // Map team leader to recruiters
    }));
    setDisplayBigSkeletonForRecruiters(false);
    setDisplayRecruiters(true);
  };

  const hasSelectedChildren = (parentId, parentType) => {
    if (parentType === "Manager") {
      const teamLeaderIds = managerToTeamLeaders[parentId] || [];
      return teamLeaderIds.some((tlId) => selectedIds.includes(tlId));
    } else if (parentType === "TeamLeader") {
      const recruiterIds = teamLeaderToRecruiters[parentId] || [];
      return recruiterIds.some((recruiterId) => selectedIds.includes(recruiterId));
    }
    return false;
  };

  const handleOk = async() => {
    setLoading(true);

    try {
       const response = await axios.get(
        `${API_BASE_URL}/report-count/${selectedIds.join(",")}/${selectedRole}/${startDate1}/${endDate1}`
      );
      setReportDataDatewise(response.data);
      setOpenReport(true);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false); // Ensures loading is disabled even if API fails
    }
    setDisplayModalContainer(false);
  };
  const handleCancel = () => {
    setDisplayModalContainer(false);
  };

  const handleCheckboxChange = async (role, id, completeValueObject) => {

    setLoading(true);

    // Determine updated IDs manually
    let updatedIds;
    if (selectedRole && selectedRole !== role) {
      setSelectedRole(role);
      updatedIds = [id]; // Reset selection for a new role
    } else {
      updatedIds = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id) // Remove unselected ID
        : [...selectedIds, id]; // Add new selected ID
      setSelectedRole(role);
    }

    // Update state
    setSelectedIds(updatedIds);

    // Handle dependent display logic
    if (role === "Manager") {
      setDisplayTeamLeaders(false);
      setDisplayRecruiters(false);
    } else if (role === "TeamLeader") {
      setDisplayRecruiters(false);
    }

    // Prepare API call
    const userIdForApi = updatedIds.join(",");

    // Date handling
    const startDate = showCustomDiv ? customStartDate : startDate1;
    const endDate = showCustomDiv ? customEndDate : endDate1;
    setFinalStartDatePropState(startDate);
    setFinalEndDatePropState(endDate);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/report-count/${userIdForApi}/${role}/${startDate}/${endDate}`
      );
      setReportDataDatewise(response.data);
      setOpenReport(true);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }

    setLoading(false);
  };

  const [displayManagers, setDisplayManagers] = useState(false);
  const [displayTeamLeaders, setDisplayTeamLeaders] = useState(false);
  const [displayRecruiters, setDisplayRecruiters] = useState(false);
  const [displayMoreButton, setDisplayMoreButton] = useState(false);
  const [displayModalContainer, setDisplayModalContainer] = useState(false);

  // date inputs
  const [selectedOption, setSelectedOption] = useState("");
  const [showCustomDiv, setShowCustomDiv] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [startDate1, setStartDate1] = useState("");
  const [endDate1, setEndDate1] = useState("");
  const [displayBigSkeletonForRecruiters, setDisplayBigSkeletonForRecruiters] = useState(false);
  const [displayBigSkeletonForTeamLeaders, setDisplayBigSkeletonForTeamLeaders] = useState(false);
  const [displayBigSkeletonForManagers, setDisplayBigSkeletonForManagers] = useState(false);

  const calculateDateRange = (option) => {
    const today = new Date();
    let startDate, endDate;

    switch (option) {
      case "Current Month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "Last Month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "Last 3 Months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last 6 Months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "Last 1 Year":
        startDate = new Date(today.getFullYear() - 1, today.getMonth() + 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      default:
        break;
    }
    return { startDate, endDate };
  };

  const handleOptionChange = async (event) => {
    const value = event.target.value;

    setSelectedOption(value);

    if (value === "custom") {
      setDisplayModalContainer(false);
      setShowCustomDiv(true);
      return;
    }

   

    // Calculate date range for predefined options
    const { startDate, endDate } = calculateDateRange(value);
    if (!startDate || !endDate) {
      console.error("Invalid date range calculated.");
      return;
    }

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    setStartDate1(formattedStartDate);
    setEndDate1(formattedEndDate);


    const finalStartDate1 = showCustomDiv ? customStartDate : formattedStartDate;
      const finalEndDate1 = showCustomDiv ? customEndDate : formattedEndDate;

      setFinalStartDatePropState(finalStartDate1);
      setFinalEndDatePropState(finalEndDate1);

    if (selectedRole === "" && selectedIds.length === 0) {
      setDisplayModalContainer(true);
      setShowCustomDiv(false);
      handleDisplayManagers();
      setDisplayMoreButton(true);
    } else {
      setDisplayModalContainer(false);
    }

    // API Call when role and IDs are selected
    if (selectedRole !== "" && selectedIds.length !== 0) {
      setLoading(true);

      const finalStartDate = showCustomDiv ? customStartDate : formattedStartDate;
      const finalEndDate = showCustomDiv ? customEndDate : formattedEndDate;

      setFinalStartDatePropState(finalStartDate);
      setFinalEndDatePropState(finalEndDate);

      const userIdForApi = selectedIds.join(",");

      try {
        const response = await axios.get(
          `${API_BASE_URL}/report-count/${userIdForApi}/${selectedRole}/${finalStartDate}/${finalEndDate}`
        );
        setReportDataDatewise(response.data);
        setOpenReport(true);
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setLoading(false); // Ensures loading is disabled even if API fails
      }
    }
  };


  const handleCustomStartDateChange = (event) => {
    setCustomStartDate(event.target.value);
    if (event.target.value && customEndDate) {
      applyCustomDateRange(event.target.value, customEndDate);
    }
  };

  const handleCustomEndDateChange = (event) => {
    setCustomEndDate(event.target.value);
    if (customStartDate && event.target.value) {
      applyCustomDateRange(customStartDate, event.target.value);
    }
  };

  const applyCustomDateRange = (start, end) => {
    setDisplayModalContainer(true);
  };


  const [allImagesForRecruiters, setAllImagesForRecruiters] = useState([]); // Initialize as an object
  useEffect(() => {
    const fetchAllImagesForRecruiters = async () => {
      const images = await Promise.all(
        recruitersList.map(async (message) => {
          return await getUserImageFromApiForReport(message.employeeId, message.jobRole);
        })
      );
      setAllImagesForRecruiters(images); // Set the array of image URLs

    };

    fetchAllImagesForRecruiters();
  }, [recruitersList]);

  const [allImagesForTeamLeaders, setAllImagesForTeamLeaders] = useState([]); // Initialize as an object

  useEffect(() => {
    const fetchAllImagesForTeamLeaders = async () => {
      const images = await Promise.all(
        teamLeadersList.map(async (message) => {
          return await getUserImageFromApiForReport(message.teamLeaderId, message.jobRole);
        })
      );
      setAllImagesForTeamLeaders(images); // Set the array of image URLs
    };

    fetchAllImagesForTeamLeaders();
  }, [teamLeadersList]);

  const [allImagesForManagers, setAllImagesForManagers] = useState([]); // Initialize as an object

  useEffect(() => {
    const fetchAllImagesForManagers = async () => {
      const images = await Promise.all(
        managersList.map(async (message) => {
          return await getUserImageFromApiForReport(message.managerId, message.jobRole);
        })
      );
      setAllImagesForManagers(images); // Set the array of image URLs
    };

    fetchAllImagesForManagers();
  }, [managersList]);

  const handleClearSelection = (userType) => {
    if (userType) {
      setSelectedRole("");
      setSelectedIds([]);
    }
  }


  const handleSelectAllNew = (role) => {
    console.log(role);
    console.log(selectedRole);
    
    
    let newIds = [];
  
    if (role === "Manager") {
      newIds = managersList.map(manager => manager.managerId);
    } else if (role === "TeamLeader") {
      newIds = teamLeadersList.map(leader => leader.teamLeaderId);
    } else if (role === "Recruiters") {
      newIds = recruitersList.map(recruiter => recruiter.employeeId);
    }
  
    setSelectedIds(prevIds => {
      // Keep previous selections if the role was already selected
      return selectedRole === role ? [...prevIds, ...newIds] : newIds;
    });
  
    setSelectedRole(role);
  };
  

  return (
    <>
      <div className="listofButtons11">
        <button className="scrollButton left" onClick={scrollLeft}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
          </svg>
        </button>
        <div className="typesOfReportDiv">
          {[
            { id: 1, label: "Candidate Report" },
            { id: 2, label: "Invoice Report" },
            { id: 3, label: "Recruiters Report" },
            // { id: 4, label: "Candidate Report" },
            // { id: 5, label: "Candidate Report" },
            // { id: 6, label: "Candidate Report" },
            // { id: 7, label: "Candidate Report" },
          ].map((report, index) => (
            <div
              key={report.id}
              className={`typeofReportSubDiv ${activeButton === report.id ? "active" : ""
                }`}
              onClick={() => handleOpenSelectDate(report.id)}
            >
              <div className="subdiviconandtext">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#000000"
                >
                  <path d="M320-480v-80h320v80H320Zm0-160v-80h320v80H320Zm-80 240h300q29 0 54 12.5t42 35.5l84 110v-558H240v400Zm0 240h442L573-303q-6-8-14.5-12.5T540-320H240v160Zm480 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80Zm-480-80v-640 640Zm0-160v-80 80Z" />
                </svg>
              </div>
              <div className="subdiviconandtext1">
                <div className="textDiv1">{report.label}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="scrollButton right" onClick={scrollRight}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
          </svg>
        </button>
      </div>


      {openSelectDate && (
        <div className="tracker-date-report-option">
          <div className="histry-date-div">
            {displayMoreButton && (
              <button
                className={`daily-tr-btn ${selectedIds.length > 0 ? "newclassforhighlightbutton" : ""}`}
                onClick={handleDisplayManagers}
              >
                <UsergroupAddOutlined />
                <DownOutlined />
              </button>

            )}

            <label className="PI-radio-label"
              style={{
                backgroundColor: selectedOption === "Current Month" && "var(--active-button1-bg)"
              }}
            >
              <input
                type="radio"
                value="Current Month"
                id="CurrentMonth"
                name="reportOption"
                checked={selectedOption === "Current Month"}
                onChange={handleOptionChange}
              />
              Current Month
            </label>
            <label className="PI-radio-label"
              style={{
                backgroundColor: selectedOption === "Last Month" && "var(--active-button1-bg)"
              }}
            >
              <input
                type="radio"
                value="Last Month"
                id="LastMonth"
                name="reportOption"
                checked={selectedOption === "Last Month"}
                onChange={handleOptionChange}
              />
              Last Month
            </label>
            <label className="PI-radio-label"
              style={{
                backgroundColor: selectedOption === "Last 3 Months" && "var(--active-button1-bg)"
              }}
            >
              <input
                type="radio"
                value="Last 3 Months"
                id="Last3Months"
                name="reportOption"
                checked={selectedOption === "Last 3 Months"}
                onChange={handleOptionChange}
              />
              Last 3 Months
            </label>
            <label className="PI-radio-label"
              style={{
                backgroundColor: selectedOption === "Last 6 Months" && "var(--active-button1-bg)"
              }}
            >
              <input
                type="radio"
                value="Last 6 Months"
                name="reportOption"
                id="Last6Months"
                checked={selectedOption === "Last 6 Months"}
                onChange={handleOptionChange}
              />
              Last 6 Months
            </label>
            <label className="PI-radio-label"
              style={{
                backgroundColor: selectedOption === "Last 1 Year" && "var(--active-button1-bg)"
              }}
            >
              <input
                type="radio"
                value="Last 1 Year"
                name="reportOption"
                id="Last1Year"
                checked={selectedOption === "Last 1 Year"}
                onChange={handleOptionChange}
              />
              Last 1 Year
            </label>
            <label className="PI-radio-label"
              style={{
                backgroundColor: selectedOption === "custom" && "var(--active-button1-bg)"
              }}
            >
              <input
                type="radio"
                value="custom"
                name="reportOption"
                id="CustomDate"
                checked={selectedOption === "custom"}
                onChange={handleOptionChange}
              />
              Custom Date
            </label>
          </div>
          <center>
            <div className="history-tracker-custom-dates">
              {showCustomDiv && (
                <div className="date-inputs">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={handleCustomStartDateChange}
                  />

                  <label>End Date:</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={handleCustomEndDateChange}
                  />
                </div>
              )}
            </div>
          </center>
        </div>
      )}

      {displayModalContainer && (
        <>
          <Modal
            width={1000}
            open={displayModalContainer}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className="mainForLists">
              {displayManagers ? (
                <Card
                  hoverable
                  style={{
                    width: 300,
                    marginRight: 10,
                    height: "65vh",
                    overflowY: "scroll",
                  }}
                  title={
                    <div className="newclearbuttonaddclass">
                      <span>Managers</span>
                      {!managersList.every(manager => selectedIds.includes(manager.managerId)) && (
  <Button color="primary" variant="outlined" onClick={() => handleSelectAllNew("Manager")}>
    Select All
  </Button>
)}

                      {selectedRole === "Manager" && selectedIds.length > 0 && (
                        <button
                          className="clearbuttonReport"
                          onClick={() => handleClearSelection("Managers")}
                        >
                          <ClearOutlined className="newcolorforclearicon" />
                        </button>
                      )}

                    </div>
                  }
                >



                  <List
                    itemLayout="horizontal"
                    dataSource={managersList}
                    renderItem={(item, index) => (
                      <List.Item
                        className={
                          hasSelectedChildren(item.managerId, "Manager") ? "highlight-item" : ""
                        }
                      >
                        <input
                          className="managersTeamRecruitersInputMargin"
                          type="checkbox"
                          checked={
                            selectedRole === "Manager" &&
                            selectedIds.includes(item.managerId)
                          }
                          onChange={() =>
                            handleCheckboxChange(
                              "Manager",
                              item.managerId,
                              item
                            )
                          }
                        />
                        <List.Item.Meta
                          avatar={
                            allImagesForManagers.length === 0 ? (
                              <Skeleton.Avatar active />
                            ) : (
                              <Avatar
                                src={
                                  allImagesForManagers.length > 0 ?
                                    allImagesForManagers[index] !== null ? allImagesForManagers[index] : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}` : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                }
                              />
                            )
                          }
                          title={item.managerName}
                        />
                        <svg
                          onClick={(e) => {
                            handleOpenDownArrowContent(item.managerId); // Your existing logic
                            toggleManager(item.managerId); // Toggle rotation
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#000000"
                          className={activeManager === item.managerId ? "rotate-icon" : ""} // Apply rotation class
                        >
                          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                        </svg>
                      </List.Item>
                    )}
                  />
                </Card>
              )
                : displayBigSkeletonForManagers && (
                  <Skeleton.Node
                    active={true}
                    style={{
                      width: 300,
                      height: "65vh"
                    }}
                  />
                )

              }
              {displayTeamLeaders ? (
                <>
                  {
                    <Card
                      hoverable
                      style={{
                        width: 300,
                        marginRight: 10,
                        height: "65vh",
                        overflowY: "scroll",
                      }}
                      title={

                        <div className="newclearbuttonaddclass">
                          <span>Team Leaders</span>
                          {!teamLeadersList.every(teamLeader => selectedIds.includes(teamLeader.teamLeaderId)) && (
  <Button color="primary" variant="outlined" onClick={() => handleSelectAllNew("TeamLeader")}>
    Select All
  </Button>
)}
                          {selectedRole === "TeamLeader" && selectedIds.length > 0 && (
                            <button
                              className="clearbuttonReport"
                              onClick={() => handleClearSelection("Team Leaders")}
                            >
                              <ClearOutlined className="newcolorforclearicon" />
                            </button>
                          )}
                        </div>
                      }

                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={teamLeadersList}
                        renderItem={(teamLeader, index) => (
                          <List.Item
                            className={
                              hasSelectedChildren(teamLeader.teamLeaderId, "TeamLeader") ? "highlight-item" : ""
                            }
                          >
                            <input
                              className="managersTeamRecruitersInputMargin"
                              type="checkbox"
                              checked={
                                selectedRole === "TeamLeader" &&
                                selectedIds.includes(teamLeader.teamLeaderId)
                              }
                              onChange={() =>
                                handleCheckboxChange(
                                  "TeamLeader",
                                  teamLeader.teamLeaderId,
                                  teamLeader
                                )
                              }
                            />
                            <List.Item.Meta
                              avatar={
                                allImagesForTeamLeaders.length === 0 ? (
                                  <Skeleton.Avatar active />
                                ) : (
                                  <Avatar
                                    src={
                                      allImagesForTeamLeaders.length > 0 ?
                                        allImagesForTeamLeaders[index] !== null ? allImagesForTeamLeaders[index] : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}` : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                    }
                                  />
                                )
                              }
                              title={teamLeader.teamLeaderName}
                            />
                            <svg
                              onClick={(e) => {
                                handleOpenDownArrowContentForRecruiters(teamLeader.teamLeaderId); // Your existing logic
                                toggleTeamLeader(teamLeader.teamLeaderId); // Toggle rotation
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 -960 960 960"
                              width="24px"
                              fill="#000000"
                              className={activeTeamLeader === teamLeader.teamLeaderId ? "rotate-icon" : ""} // Apply rotation class
                            >
                              <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                            </svg>
                          </List.Item>
                        )}
                      />
                    </Card>
                  }
                </>
              )
                : displayBigSkeletonForTeamLeaders && (
                  <Skeleton.Node
                    active={true}
                    style={{
                      width: 300,
                      height: "65vh"
                    }}
                  />
                )

              }

              {displayRecruiters ? (
                <>
                  {
                    <Card
                      hoverable
                      style={{
                        width: 300,
                        height: "65vh",
                        overflowY: "scroll",
                      }}
                      title={

                        <div className="newclearbuttonaddclass">
                          <span>Recruiters</span>
                          {!recruitersList.every(recruiter => selectedIds.includes(recruiter.employeeId)) && (
  <Button color="primary" variant="outlined" onClick={() => handleSelectAllNew("Recruiters")}>
    Select All
  </Button>
)}

                          {selectedRole === "Recruiters" && selectedIds.length > 0 && ( // Conditional rendering
                            <>
                              <button
                                className="clearbuttonReport"
                                onClick={() => handleClearSelection("Recruiters")}
                              >
                                <ClearOutlined className="newcolorforclearicon" />

                              </button>
                            </>
                          )
                        }
                            
                        </div>
                      }
                    >
                      <List
                        itemLayout="horizontal"
                        dataSource={recruitersList}
                        renderItem={(recruiter, index) => (
                          <List.Item>
                            <input
                              className="managersTeamRecruitersInputMargin"
                              type="checkbox"
                              checked={
                                selectedRole === "Recruiters" &&
                                selectedIds.includes(recruiter.employeeId)
                              }
                              onChange={() =>
                                handleCheckboxChange(
                                  "Recruiters",
                                  recruiter.employeeId,
                                  recruiter
                                )
                              }
                            />
                            <List.Item.Meta
                              avatar={
                                allImagesForRecruiters.length === 0 ? (
                                  <Skeleton.Avatar active />
                                ) : (
                                  <Avatar
                                    src={
                                      allImagesForRecruiters.length > 0
                                        ? allImagesForRecruiters[index] !== null
                                          ? allImagesForRecruiters[index]
                                          : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                        : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`
                                    }
                                  />
                                )
                              }
                              title={recruiter.employeeName}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  }
                </>
              )
                : displayBigSkeletonForRecruiters && (
                  <Skeleton.Node
                    active={true}
                    style={{
                      width: 300,
                      height: "65vh"
                    }}
                  />
                )
              }

            </div>
          </Modal>
        </>
      )}

      {loading && <Loader />}
      {openReport && (
        <CreateReportTable
          reportDataDatewise={reportDataDatewise}
          selectedIdsProp={selectedIds}
          selectedJobRole={selectedRole}
          finalStartDatePropState={finalStartDatePropState}
          finalEndDatePropState={finalEndDatePropState}
          loginEmployeeName={loginEmployeeName}
          selectedRole={selectedRole}
          selectedIds={selectedIds}
        />
      )}
    </>
  );
};

export default MonthReport;
